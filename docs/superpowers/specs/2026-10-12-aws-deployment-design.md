# Project setup and AWS deployment — Design

Date: 2026-10-12
Status: approved in brainstorming, awaiting implementation plan
Baseline: `docs/project-spec.md`

## 1. Goals

1. Make the repository easy to work on with Claude Code: `CLAUDE.md`, English documentation, lint, format, tests, CI.
2. Move production hosting from GitHub Pages to AWS with a custom domain and HTTPS.
3. Make the contact form deliver leads: email (SES), Telegram, and a DynamoDB record.
4. Keep everything as code (CloudFormation) so the owner learns AWS and can rebuild from scratch.

Non-goals: replacing stock photos and placeholder contacts, analytics, cookie banner, captcha, server-side rendering, a staging environment. Interface changes requested later get their own spec.

## 2. Decisions (from brainstorming)

| Topic | Decision |
|---|---|
| Hosting | S3 (private) + CloudFront with Origin Access Control |
| Infrastructure as code | CloudFormation YAML templates in `infra/`, deployed with AWS CLI |
| Region | `eu-north-1` (Stockholm) for S3, Lambda, DynamoDB, SES, API; `us-east-1` for the CloudFront certificate (ACM requirement) |
| Domain | Bought through Route 53 (`.com` / `.eu` / `.studio`; exact name chosen by the owner). Hosted zone created by the registration |
| Form backend | API Gateway HTTP API → Lambda (Node.js 22) → DynamoDB + SES + Telegram |
| Secrets | SSM Parameter Store `SecureString`, created once by CLI, never in git |
| Deploy of the site | Existing GitHub Actions `deploy.yml`, OIDC role, no long-lived keys |
| Deploy of infrastructure | Locally via `aws cloudformation deploy`, run by Claude with the owner confirming each step |
| GitHub Pages | Disabled after cutover; `pages.yml` deleted |
| Cost control | AWS Budget, $5/month alert to the owner's email |
| Documentation language | English. Commit messages stay Ukrainian (matches history) |

### Alternatives considered

- **AWS Amplify Hosting**: fastest to start, but hides the pieces the owner wants to learn and still needs a separate form backend. Rejected.
- **Lambda Function URL behind CloudFront (`/api/*`)**: same-origin, no CORS, but POST through OAC requires the browser to send a body hash header and there is no built-in throttling. Rejected in favour of HTTP API.
- **AWS CDK**: more expressive, but adds a TypeScript toolchain and synthesises templates the owner would not read. Plain CloudFormation chosen.
- **Single stack for site and form**: fewer files, but a failed form change would roll back hosting too. Separate stacks chosen.

## 3. Part A — Repository setup

### 3.1 `CLAUDE.md`

English, concise. Sections:
- Project summary and stack; `nvm use` / Node 22.
- Commands: `npm run dev`, `build`, `preview`, `lint`, `format`, `test`, `test:watch`.
- Code map: `src/data.js` (language-independent data, prices in NOK), `src/i18n/*` (five languages, identical key structure, arrays matched by index), `src/theme.js`, `src/components/*`, `infra/*`, `docs/*`.
- Rules: no user-facing text inside components, only via `useLang()`; when adding an array item add it in all five languages; styling only via MUI `sx` (no CSS files); MUI Grid v2 (`size`), never `item xs`; prices only in `data.js`; never edit `dist/`; never commit secrets or `.env`.
- Workflow: brainstorm → spec in `docs/superpowers/specs/` → plan in `docs/superpowers/plans/` → TDD; run `npm run lint && npm test && npm run build` before committing.
- Deployment pointers: `docs/deploy-runbook.md`, `infra/README.md`.

### 3.2 Documentation

- `docs/project-spec.md` — current-state specification (written).
- `docs/superpowers/specs/2026-10-12-aws-deployment-design.md` — this document.
- `docs/deploy-runbook.md` — English operator runbook: prerequisites, stack deploy commands, how to rotate secrets, how to roll back, how to destroy. Replaces `DEPLOY.md`, which is deleted. `MARKET.md` is kept unchanged.
- `README.md` — rewritten in English: quick start, scripts, links to docs.
- `infra/README.md` — one paragraph per template, parameters, outputs.

### 3.3 Tooling

- **ESLint 9** flat config (`eslint.config.js`): `@eslint/js` recommended, `eslint-plugin-react` (jsx-runtime), `eslint-plugin-react-hooks`, `eslint-plugin-react-refresh`, `eslint-config-prettier`. Ignores `dist/`, `node_modules/`, `coverage/`.
- **Prettier** (`.prettierrc`): `singleQuote: true`, `printWidth: 160`, `trailingComma: 'all'`, `semi: true`. The code already follows this style except for 179 lines longer than 160 characters; one dedicated formatting commit brings everything in line.
- **Vitest** with `jsdom`, `@testing-library/react`, `@testing-library/jest-dom`, `@testing-library/user-event`. Config lives in `vite.config.js` (`test` block) with `src/test/setup.js`; `test.include` covers `src/**/*.test.{js,jsx}` and `infra/**/*.test.mjs`.
- **npm scripts**: `lint`, `lint:fix`, `format`, `format:check`, `test` (`vitest run`), `test:watch`.
- **CI** `.github/workflows/ci.yml`: on push and pull request → `npm ci`, `npm run lint`, `npm run format:check`, `npm test`, `npm run build`, and `cfn-lint infra/*.yaml` (installed via pip; works without AWS credentials, unlike `aws cloudformation validate-template`).

### 3.4 Initial tests

- `src/i18n/currency.test.js`: NOK/EUR/UAH formatting, rounding steps, unknown currency fallback.
- `src/i18n/detect.test.jsx`: localStorage, `?lang=`, `navigator.languages` with `nb` → `no`, default.
- `src/i18n/structure.test.js`: all five language files have the same key paths and the same array lengths (guards the index-matching described in `project-spec.md` §6.2).
- `src/App.test.jsx`: renders without crashing, all 12 section ids present.
- `src/components/Contact.test.jsx`: added together with the form change (§5).

## 4. Part B — AWS architecture

### 4.1 Stacks

```
us-east-1                       eu-north-1
┌──────────────────────┐        ┌──────────────────────────────┐   ┌──────────────────────────────────┐
│ stella-certificate   │        │ stella-site                  │   │ stella-form                      │
│  ACM certificate     │──arn──▶│  S3 bucket (private)         │   │  HTTP API  /lead  (CORS, throttle)│
│  DNS validation      │        │  CloudFront + OAC            │   │  Lambda nodejs22.x               │
│  records in Route 53 │        │  Response headers policy     │   │  DynamoDB table                  │
└──────────────────────┘        │  CloudFront Function www→apex│   │  SES EmailIdentity (domain, DKIM)│
                                │  Route 53 A/AAAA aliases     │   │  Route 53 DKIM CNAMEs            │
                                │  IAM OIDC role for GitHub    │   │  API custom domain api.<domain>  │
                                └──────────────────────────────┘   │  CloudWatch logs + error alarm   │
                                                                   └──────────────────────────────────┘
Shared inputs: DomainName, HostedZoneId (from Route 53 registration)
```

Files: `infra/certificate.yaml`, `infra/site.yaml`, `infra/form.yaml`, `infra/form/src/handler.mjs` (only this directory is packaged into the Lambda), `infra/form/handler.test.mjs`, `infra/params/*.example.json` (committed) and `infra/params/*.json` (real values, git-ignored because the repository is public), `infra/README.md`.

### 4.2 `stella-certificate` (us-east-1)

- `AWS::CertificateManager::Certificate` for `<domain>` with SAN `www.<domain>`, `ValidationMethod: DNS`, `DomainValidationOptions` pointing at `HostedZoneId` so CloudFormation creates the validation records itself.
- Output: `CertificateArn`.

Note: the API Gateway custom domain in `eu-north-1` needs a regional certificate in `eu-north-1`. `stella-form` therefore creates its own certificate for `api.<domain>`; `stella-certificate` covers only the CloudFront names.

### 4.3 `stella-site` (eu-north-1)

Parameters: `DomainName`, `HostedZoneId`, `CertificateArn`, `GitHubRepo` (`owner/name`), `GitHubBranch` (`main`).

Resources:
- S3 bucket: all public access blocked, versioning on, server-side encryption, lifecycle rule expiring non-current versions after 30 days. Bucket policy allows `s3:GetObject` only to the CloudFront distribution via OAC (`AWS:SourceArn` condition).
- CloudFront distribution: origin = bucket regional endpoint with OAC; `DefaultRootObject: index.html`; HTTPS redirect; HTTP/2 + HTTP/3; price class 100 (Europe + North America); aliases `<domain>` and `www.<domain>`; custom error responses 403 and 404 → `/index.html` with 200 (so `/?lang=en` and deep links work); cache policy `CachingOptimized`; response headers policy with HSTS, `X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`, and a `Content-Security-Policy` allowing self, `images.unsplash.com`, `api.<domain>`, and Emotion inline styles (`style-src 'unsafe-inline'`).
- CloudFront Function (viewer-request): if host starts with `www.`, 301 to apex.
- Route 53: A and AAAA alias records for apex and `www` to the distribution.
- GitHub OIDC: `AWS::IAM::OIDCProvider` for `token.actions.githubusercontent.com` (created once; parameter `CreateOidcProvider` defaults to `true`), and role `github-deploy-stella` trusting `repo:<GitHubRepo>:ref:refs/heads/<GitHubBranch>`, with permissions `s3:ListBucket`, `s3:PutObject`, `s3:DeleteObject`, `s3:GetObject` on the bucket, `cloudfront:CreateInvalidation` on the distribution.
- Outputs: `BucketName`, `DistributionId`, `DistributionDomainName`, `DeployRoleArn`.

### 4.4 `stella-form` (eu-north-1)

Parameters: `DomainName`, `HostedZoneId`, `NotifyEmail` (studio inbox), `FromAddress` (default `noreply@<domain>`), `TelegramTokenParam` (SSM name, default `/stella/telegram/token`), `TelegramChatIdParam` (default `/stella/telegram/chat-id`), `AllowedOrigin` (default `https://<domain>`).

Resources:
- Regional ACM certificate for `api.<domain>` with DNS validation; API Gateway custom domain `api.<domain>`; Route 53 A/AAAA alias to it.
- `AWS::ApiGatewayV2::Api` (HTTP), CORS: origin `AllowedOrigin`, methods `POST, OPTIONS`, headers `content-type`; stage `$default` with throttling `RateLimit: 5`, `BurstLimit: 10`; route `POST /lead` → Lambda integration (payload format 2.0).
- Lambda `stella-lead-handler`: `nodejs22.x`, 256 MB, 10 s timeout, code packaged from `infra/form/handler.mjs` with `aws cloudformation package`. Environment: `TABLE_NAME`, `NOTIFY_EMAIL`, `FROM_ADDRESS`, `TELEGRAM_TOKEN_PARAM`, `TELEGRAM_CHAT_ID_PARAM`, `ALLOWED_ORIGIN`. Role: `dynamodb:PutItem` on the table, `ses:SendEmail` restricted to the domain identity, `ssm:GetParameter(s)` + `kms:Decrypt` for the two parameters, CloudWatch logs.
- DynamoDB table `stella-leads`: on-demand billing, partition key `pk` (`LEAD`), sort key `sk` (`<ISO timestamp>#<uuid>`), point-in-time recovery on, TTL disabled (leads are kept).
- `AWS::SES::EmailIdentity` for `<domain>` with Easy DKIM (RSA 2048); three Route 53 CNAME records built from `DkimDNSTokenName1..3` / `DkimDNSTokenValue1..3`; MAIL FROM not configured (YAGNI).
- CloudWatch log group (14-day retention) and alarm `Errors >= 1 in 5 min` → SNS topic → `NotifyEmail`.
- Outputs: `ApiUrl` (`https://api.<domain>/lead`), `TableName`.

Out-of-template, one-time manual steps (documented in the runbook): put the Telegram token and chat id into SSM; verify `NotifyEmail` as an SES identity (required while the account is in the SES sandbox); confirm the SNS subscription email.

### 4.5 Lambda handler behaviour (`infra/form/src/handler.mjs`)

Input (JSON body): `name`, `phone`, `car`, `service`, `message`, `lang`, `website` (honeypot), plus `page` (URL). Output JSON with `ok: true | false` and `error` code.

1. Reject non-JSON or body > 10 KB → 400 `bad_request`.
2. Honeypot `website` non-empty → return 200 `{ ok: true }` without doing anything (do not tip off bots).
3. Validate: `name` 1–100 chars, `phone` 5–30 chars matching `[+\d\s()\-]`, other fields ≤ 500 chars, `lang` in `no|en|de|uk|ru`. Failure → 400 `validation`.
4. Build the lead record: `pk`, `sk`, fields, `ip` (from `requestContext.http.sourceIp`), `userAgent`, `createdAt`.
5. `PutItem` to DynamoDB. If this fails → 500 `storage`.
6. In parallel (`Promise.allSettled`): SES email to `NOTIFY_EMAIL` (plain text, subject `New lead: <name> — <service>`), Telegram `sendMessage` to the chat. Failures are logged with `console.error`, not returned to the user.
7. Return 200 `{ ok: true }`.

SSM parameters are read once per container and cached in module scope.

Tests (`infra/form/handler.test.mjs`, Vitest, AWS SDK clients mocked): valid lead stores + notifies; honeypot short-circuits; invalid phone → 400; DynamoDB failure → 500; SES failure still returns 200 and logs.

### 4.6 CI/CD for the site

`.github/workflows/deploy.yml` changes:
- Keep the `if: vars.S3_BUCKET != ''` guard.
- Build with `VITE_API_URL: ${{ vars.VITE_API_URL }}`.
- Assume `secrets.AWS_ROLE_ARN` in `vars.AWS_REGION` (`eu-north-1`).
- Keep the existing cache strategy: hashed assets `max-age=31536000, immutable`; `index.html` `no-cache`; invalidate `/index.html` and `/`.
- Add `favicon.svg` to the `no-cache` list (not hashed).

Repository variables: `AWS_REGION`, `S3_BUCKET`, `CLOUDFRONT_DISTRIBUTION_ID`, `VITE_API_URL`. Secret: `AWS_ROLE_ARN`.

`.github/workflows/pages.yml` is deleted at cutover; `BASE_PATH` handling in `vite.config.js` is removed (base is always `/`).

### 4.7 Cost and guardrails

- AWS Budget `stella-monthly`, $5, 80 % and 100 % actual-spend alerts to the owner's email. Created by CLI (budgets live in `us-east-1`).
- Expected monthly cost for a landing page with a few hundred visits and a few dozen leads: under $1 (CloudFront, S3, Lambda, API Gateway, DynamoDB, SES all inside free tiers or cents). Route 53 hosted zone $0.50/month. Domain $12–15/year for `.com`.
- Root user: MFA enabled; day-to-day work through `aws login` with the existing `AccountFullAccessRole`.

## 5. Part C — Frontend changes

### 5.1 Contact form (`src/components/Contact.jsx`)

- Read `const API_URL = import.meta.env.VITE_API_URL`.
- `onSubmit`: if `API_URL` is empty → current behaviour (reset + success Snackbar), so `npm run dev` works without a backend. Otherwise collect `FormData` into JSON, add `lang` and `page`, `fetch(API_URL, { method: 'POST', headers: { 'content-type': 'application/json' }, body })`. While pending, disable the submit button. On `ok` → reset + success Snackbar. On network error or `!response.ok` → error Snackbar (`severity="error"`), keep the form values.
- Add a hidden honeypot field: `<Box component="input" name="website" tabIndex={-1} autoComplete="off" aria-hidden sx={{ position: 'absolute', left: -10000 }} />`.
- No new dependencies.

### 5.2 i18n

New keys in all five languages under `contact.form`: `error` ("Something went wrong. Please call us or try again."), `sending` (button label while pending).

### 5.3 Environment

- `.env.example` with `VITE_API_URL=` and a comment. `.env*` already ignored.
- `vite.config.js`: add the Vitest `test` block. `BASE_PATH` stays until GitHub Pages is switched off (rollout step 9).

### 5.4 Tests

`src/components/Contact.test.jsx`: submits JSON with the expected fields; shows success on `ok`; shows error on 500; disables the button while pending; works with `VITE_API_URL` unset.

## 6. Rollout order

Each step ends with a verification; the implementation plan will expand these into tasks.

1. **Repository setup** (Part A): tooling, tests, `CLAUDE.md`, docs, CI. Verify: CI green on `main`.
2. **Account prerequisites**: payment method added, root MFA, `aws login` works, Budget created. Verify: `aws sts get-caller-identity`, `aws budgets describe-budgets`.
3. **Domain**: availability check and registration via Route 53 (owner approves the purchase). Verify: hosted zone exists, `dig NS` shows AWS name servers.
4. **Certificate stack** in `us-east-1`. Verify: status `ISSUED`.
5. **Site stack**, first manual `aws s3 sync dist/`. Verify: `https://<domain>` serves the site, `www` redirects, security headers present.
6. **Form stack**: SSM parameters, SES identity verification, deploy, SNS confirmation. Verify: `curl -X POST` returns `{ok:true}`, email and Telegram received, DynamoDB item present, honeypot and validation rejected.
7. **Frontend form change** (Part C) with tests; set `VITE_API_URL`; deploy via CI. Verify: lead submitted from the live site arrives.
8. **CI/CD cutover**: GitHub variables/secret, `deploy.yml` run green. Verify: a visible change reaches the domain within minutes.
9. **Disable GitHub Pages**: delete `pages.yml`, turn off Pages in repository settings, remove `BASE_PATH`. Verify: old URL stops serving; `main` deploys only to AWS.
10. **Runbook finalised** with real identifiers (bucket, distribution id, API URL) in `docs/deploy-runbook.md`.

## 7. Error handling and recovery

- Stack failures roll back automatically; `--disable-rollback` is not used. Runbook explains how to read `describe-stack-events`.
- Site rollback: S3 versioning allows restoring the previous `index.html`; or re-run the previous GitHub Actions job.
- Form outage: the frontend shows the error message with the phone number still visible on the page; leads are never silently dropped because DynamoDB write happens first.
- Lost Telegram token: rotate in SSM; Lambda picks it up on the next cold start (or after a redeploy).
- Destroy: delete stacks in reverse order (`form`, `site`, `certificate`); empty the bucket first.

## 8. Open items for the implementation plan

- Exact domain name (owner decides at step 3).
- Studio inbox address for `NotifyEmail` and SES verification.
- Telegram bot token and chat id (owner creates the bot via @BotFather).
- Whether `ru` and `uk` price display should keep static rates (unchanged for now).
