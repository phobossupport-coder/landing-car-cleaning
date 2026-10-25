# AWS Deployment Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Serve the landing page from AWS on a custom domain with HTTPS, make the contact form deliver leads to email, Telegram and DynamoDB, deploy from GitHub Actions, and switch GitHub Pages off.

**Architecture:** Three CloudFormation stacks: `stella-certificate` (us-east-1, ACM for CloudFront), `stella-site` (eu-north-1: private S3 + CloudFront with OAC + Route 53 + GitHub OIDC role) and `stella-form` (eu-north-1: HTTP API + Lambda Node 22 + DynamoDB + SES + Telegram). The frontend posts JSON to `VITE_API_URL`. Infrastructure is deployed from the owner's machine with AWS CLI (Claude runs the commands, the owner confirms each one); the site is deployed by the existing `deploy.yml` workflow.

**Tech Stack:** CloudFormation YAML, AWS CLI v2 (`aws login` session), `cfn-lint`, Lambda `nodejs22.x` with AWS SDK v3 (bundled in the runtime; installed locally only for tests), Vitest, `gh` CLI.

**Spec:** `docs/superpowers/specs/2026-10-12-aws-deployment-design.md` (§4–§7). Prerequisite: `docs/superpowers/plans/2026-10-12-repo-setup.md` is complete (lint, Vitest, `renderWithProviders`, CI).

## Global Constraints

- Regions: `eu-north-1` for everything except `stella-certificate` (`us-east-1`) and AWS Budgets (`us-east-1`).
- Stack names: `stella-certificate`, `stella-site`, `stella-form`. Lambda name `stella-lead-handler`, table `stella-leads`, IAM role `github-deploy-stella`.
- SSM parameter names: `/stella/telegram/token`, `/stella/telegram/chat-id` (SecureString). Never in git, never echoed to the terminal.
- `infra/params/*.json` (real ARNs, zone ids, emails) are git-ignored; `infra/params/*.example.json` are committed. Parameter files use the CLI list form `[{"ParameterKey": "...", "ParameterValue": "..."}]`.
- No `--disable-rollback`. Every `deploy` is followed by a verification command.
- Cache rules (unchanged from the current workflow): hashed assets `public,max-age=31536000,immutable`; `index.html` and `favicon.svg` `no-cache`.
- Frontend rules from `CLAUDE.md`: text only via i18n in all five languages, `sx` only, Grid v2.
- Commit messages in Ukrainian; docs in English.
- `$SCRATCH` below means the session scratchpad directory; `$ACCOUNT` is `aws sts get-caller-identity --query Account --output text`; `$DOMAIN` is the registered domain.

## Review Focus

1. Browser preflight: `OPTIONS /lead` with `Origin: https://$DOMAIN` must return 204 with `access-control-allow-origin`, or every real submission fails while `curl -X POST` works — verified in Task 6.
2. API Gateway may base64-encode the body; the handler must decode when `isBase64Encoded` is true — test in Task 5.
3. Double click on "Send" must not create two leads — pending-state test in Task 7.
4. `https://www.$DOMAIN/?lang=en` must redirect to `https://$DOMAIN/?lang=en` keeping the query string — verified in Task 4.
5. After a deploy, browsers must fetch the new `index.html`; `/` must answer with `cache-control: no-cache` — verified in Task 8.

---

### Task 1: Account prerequisites and budget

**Files:** none committed. `$SCRATCH/budget.json`, `$SCRATCH/budget-notifications.json`.

**Interfaces:**

- Produces: a working `aws` session (`aws login`), `$ACCOUNT`, budget `stella-monthly`.

- [ ] **Step 1: Owner, in the AWS console:** add a payment method (Billing → Payment preferences) and enable MFA on the root user (Security credentials). Claude cannot do either.

- [ ] **Step 2: Owner runs `! aws login`** in this session (opens the browser). Then:

Run: `aws sts get-caller-identity`
Expected: JSON with `Account` and an `Arn` containing `AccountFullAccessRole`.

- [ ] **Step 3: Create the budget**

`$SCRATCH/budget.json`: `{"BudgetName":"stella-monthly","BudgetLimit":{"Amount":"5","Unit":"USD"},"TimeUnit":"MONTHLY","BudgetType":"COST"}`.
`$SCRATCH/budget-notifications.json`: two entries, `ACTUAL` `GREATER_THAN` thresholds `80` and `100` (`ThresholdType: PERCENTAGE`), each with one `EMAIL` subscriber = the owner's address (ask the owner; do not reuse the git email without confirmation).

Run: `aws budgets create-budget --region us-east-1 --account-id "$ACCOUNT" --budget file://$SCRATCH/budget.json --notifications-with-subscribers file://$SCRATCH/budget-notifications.json`
Verify: `aws budgets describe-budgets --region us-east-1 --account-id "$ACCOUNT" --query 'Budgets[].BudgetName'` → `["stella-monthly"]`.

---

### Task 2: Domain registration and parameter files

**Files:**

- Create: `infra/params/certificate.example.json`, `infra/params/certificate.json` (ignored)
- Modify: `.gitignore` (add `infra/params/*.json`, `!infra/params/*.example.json`, `coverage`)

**Interfaces:**

- Produces: `$DOMAIN`, `HostedZoneId` (without the `/hostedzone/` prefix), used by every stack.

- [ ] **Step 1: Check availability of the owner's candidate names**

Run (per candidate): `aws route53domains check-domain-availability --region us-east-1 --domain-name "<candidate>"`
Expected: `"Availability": "AVAILABLE"` for the chosen one.

- [ ] **Step 2: Owner registers the domain in the console** (Route 53 → Registered domains → Register domains): auto-renew on, privacy protection on. Registration contact details stay in the console, not in the repo. Wait for the "Domain registration successful" email (minutes to an hour for `.com`).

- [ ] **Step 3: Read the hosted zone id**

Run: `aws route53 list-hosted-zones-by-name --dns-name "$DOMAIN" --query 'HostedZones[0].Id' --output text | sed 's|/hostedzone/||'`
Verify: `dig NS "$DOMAIN" +short` lists four `awsdns-*` name servers.

- [ ] **Step 4: Write parameter files and ignore rules**

`certificate.example.json` with `DomainName=example.com`, `HostedZoneId=Z0000000000000000000`; `certificate.json` with real values. Update `.gitignore`.

- [ ] **Step 5: Commit**

```bash
git add .gitignore infra/params/certificate.example.json
git commit -m "Параметри стеків: приклади, реальні значення поза git"
```

---

### Task 3: `stella-certificate` stack

**Files:**

- Create: `infra/certificate.yaml`, `infra/README.md`

**Interfaces:**

- Produces: output `CertificateArn` (us-east-1), consumed by Task 4.

- [ ] **Step 1: Install cfn-lint**

Run: `python3 -m pip install --user cfn-lint && cfn-lint --version`

- [ ] **Step 2: Write `infra/certificate.yaml`**

Parameters `DomainName`, `HostedZoneId`. One resource `Certificate` (`AWS::CertificateManager::Certificate`): `DomainName: !Ref DomainName`, `SubjectAlternativeNames: [!Sub 'www.${DomainName}']`, `ValidationMethod: DNS`, `DomainValidationOptions` for both names with `HostedZoneId`. Output `CertificateArn`.

- [ ] **Step 3: Lint**

Run: `cfn-lint infra/certificate.yaml`
Expected: no output, exit 0.

- [ ] **Step 4: Deploy**

Run: `aws cloudformation deploy --region us-east-1 --stack-name stella-certificate --template-file infra/certificate.yaml --parameter-overrides file://infra/params/certificate.json`
Expected: "Successfully created/updated stack". Takes a few minutes while DNS validation completes.

- [ ] **Step 5: Verify**

Run:

```bash
CERT_ARN=$(aws cloudformation describe-stacks --region us-east-1 --stack-name stella-certificate --query 'Stacks[0].Outputs[?OutputKey==`CertificateArn`].OutputValue' --output text)
aws acm describe-certificate --region us-east-1 --certificate-arn "$CERT_ARN" --query 'Certificate.Status' --output text
```

Expected: `ISSUED`.

- [ ] **Step 6: Start `infra/README.md`** (one paragraph per template: purpose, region, parameters, outputs; add sections as stacks are added) and commit.

```bash
git add infra/certificate.yaml infra/README.md
git commit -m "CloudFormation: сертифікат ACM для CloudFront"
```

---

### Task 4: `stella-site` stack and first upload

**Files:**

- Create: `infra/site.yaml`, `infra/params/site.example.json`, `infra/params/site.json` (ignored)
- Modify: `infra/README.md`

**Interfaces:**

- Consumes: `CertificateArn` (Task 3), `HostedZoneId` (Task 2).
- Produces: outputs `BucketName`, `DistributionId`, `DistributionDomainName`, `DeployRoleArn`, `SiteUrl`; consumed by Task 8.

- [ ] **Step 1: Write `infra/site.yaml`**

Parameters: `DomainName`, `HostedZoneId`, `CertificateArn`, `GitHubRepo` (default `phobossupport-coder/landing-car-cleaning`), `GitHubBranch` (default `main`), `CreateOidcProvider` (`true|false`, default `true`). Condition `ShouldCreateOidc`.

Resources (logical names are the contract):

- `SiteBucket` — no explicit name; all four public-access blocks `true`; versioning enabled; SSE-S3; lifecycle `NoncurrentVersionExpiration: 30` days.
- `OriginAccessControl` — `OriginAccessControlOriginType: s3`, `SigningBehavior: always`, `SigningProtocol: sigv4`.
- `ResponseHeadersPolicy` — HSTS `max-age=63072000; includeSubDomains`, `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, CSP exactly:
  `default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https://images.unsplash.com; font-src 'self'; connect-src 'self' https://api.${DomainName}; frame-ancestors 'none'; base-uri 'self'; form-action 'self'`.
- `RedirectFunction` — `AWS::CloudFront::Function`, runtime `cloudfront-js-2.0`, `AutoPublish: true`, code:
  ```js
  function handler(event) {
    var request = event.request;
    var host = request.headers.host.value;
    if (!host.startsWith('www.')) return request;
    var qs = Object.keys(request.querystring)
      .map(function (k) {
        var v = request.querystring[k].value;
        return encodeURIComponent(k) + (v === '' ? '' : '=' + encodeURIComponent(v));
      })
      .join('&');
    return {
      statusCode: 301,
      statusDescription: 'Moved Permanently',
      headers: { location: { value: 'https://' + host.slice(4) + request.uri + (qs ? '?' + qs : '') } },
    };
  }
  ```
- `Distribution` — `Enabled`, `HttpVersion: http2and3`, `IPV6Enabled: true`, `PriceClass_100`, `Aliases` apex + www, `DefaultRootObject: index.html`; origin `S3Origin` = `!GetAtt SiteBucket.RegionalDomainName` with `OriginAccessControlId` and empty `S3OriginConfig.OriginAccessIdentity`; default behaviour: `redirect-to-https`, methods `GET HEAD OPTIONS`, `Compress: true`, managed cache policy `658327ea-f89d-4fab-a63d-7e88639e58f6` (CachingOptimized), the response headers policy, function association `viewer-request`; `CustomErrorResponses` 403 and 404 → `/index.html`, code 200, `ErrorCachingMinTTL: 10`; `ViewerCertificate` ACM arn, `sni-only`, `TLSv1.2_2021`.
- `SiteBucketPolicy` — allow `s3:GetObject` to principal `cloudfront.amazonaws.com` on `${SiteBucket.Arn}/*` with condition `AWS:SourceArn = arn:aws:cloudfront::${AWS::AccountId}:distribution/${Distribution}`.
- `ApexA`, `ApexAAAA`, `WwwA`, `WwwAAAA` — alias records to the distribution (`HostedZoneId: Z2FDTNDATAQYW2`).
- `GitHubOidcProvider` (conditional) — URL `https://token.actions.githubusercontent.com`, client id `sts.amazonaws.com`, thumbprints `6938fd4d98bab03faadb97b34396831e3780aea1`, `1c58a3a8518e8759bf075b76b750d4f2df264fcd`.
- `DeployRole` — `RoleName: github-deploy-stella`; trust `sts:AssumeRoleWithWebIdentity` from the provider ARN (`!If` created vs existing `arn:aws:iam::${AWS::AccountId}:oidc-provider/token.actions.githubusercontent.com`) with `aud = sts.amazonaws.com` and `sub` like `repo:${GitHubRepo}:ref:refs/heads/${GitHubBranch}`; inline policy: `s3:ListBucket` on the bucket, `s3:GetObject s3:PutObject s3:DeleteObject` on `bucket/*`, `cloudfront:CreateInvalidation` on the distribution ARN.

Outputs: `BucketName`, `DistributionId`, `DistributionDomainName`, `DeployRoleArn`, `SiteUrl` (`https://${DomainName}`).

- [ ] **Step 2: Lint and deploy**

Run: `cfn-lint infra/site.yaml` → exit 0, then
`aws cloudformation deploy --region eu-north-1 --stack-name stella-site --template-file infra/site.yaml --parameter-overrides file://infra/params/site.json --capabilities CAPABILITY_NAMED_IAM`
Expected: success after 5–10 minutes (CloudFront propagation).

- [ ] **Step 3: First upload**

```bash
BUCKET=$(aws cloudformation describe-stacks --region eu-north-1 --stack-name stella-site --query 'Stacks[0].Outputs[?OutputKey==`BucketName`].OutputValue' --output text)
npm run build
aws s3 sync dist "s3://$BUCKET" --delete --exclude index.html --exclude favicon.svg --cache-control "public,max-age=31536000,immutable"
aws s3 cp dist/index.html "s3://$BUCKET/index.html" --cache-control no-cache
aws s3 cp dist/favicon.svg "s3://$BUCKET/favicon.svg" --cache-control no-cache
```

`BASE_PATH` must be unset so assets resolve from `/`.

- [ ] **Step 4: Verify**

```bash
curl -sI "https://$DOMAIN" | grep -iE '^(HTTP|strict-transport-security|content-security-policy|x-frame-options)'
curl -sI "https://www.$DOMAIN/?lang=en" | grep -iE '^(HTTP|location)'
curl -s "https://$DOMAIN/?lang=de" | grep -c 'id="root"'
```

Expected: `HTTP/2 200` with the three headers; `HTTP/2 301` and `location: https://$DOMAIN/?lang=en`; `1`. Owner opens the site in a browser and switches languages.

- [ ] **Step 5: Commit**

```bash
git add infra/site.yaml infra/params/site.example.json infra/README.md
git commit -m "CloudFormation: S3 + CloudFront + Route 53 + OIDC-роль для GitHub"
```

---

### Task 5: Lambda lead handler (TDD)

**Files:**

- Create: `infra/form/src/handler.mjs`, `infra/form/handler.test.mjs`
- Modify: `package.json` (devDependencies), `eslint.config.js` (node globals for `infra/**/*.mjs`)

**Interfaces:**

- Produces: `export async function handler(event)` → `{ statusCode: number, headers: { 'content-type': 'application/json' }, body: string }`; `export function validate(input)` → `{ ok: true, lead: object } | { ok: false, errors: string[] }`. Env: `TABLE_NAME`, `NOTIFY_EMAIL`, `FROM_ADDRESS`, `TELEGRAM_TOKEN_PARAM`, `TELEGRAM_CHAT_ID_PARAM`. SSM values cached in module scope.

- [ ] **Step 1: Install SDK packages for local tests**

```bash
npm install -D @aws-sdk/client-dynamodb @aws-sdk/lib-dynamodb @aws-sdk/client-sesv2 @aws-sdk/client-ssm
```

Add to `eslint.config.js`: `{ files: ['infra/**/*.mjs'], languageOptions: { globals: globals.node } }`.

- [ ] **Step 2: Write the failing tests `infra/form/handler.test.mjs`**

Mocks (top of file, before importing the handler with `await import(...)` inside `beforeEach` after `vi.resetModules()`):

- `@aws-sdk/lib-dynamodb`: `DynamoDBDocumentClient.from = () => ({ send: ddbSend })`, `PutCommand = class { constructor(input) { this.input = input; } }`.
- `@aws-sdk/client-dynamodb`: `DynamoDBClient = class {}`.
- `@aws-sdk/client-sesv2`: `SESv2Client = class { send = sesSend }`, `SendEmailCommand = class { constructor(input) { this.input = input; } }`.
- `@aws-sdk/client-ssm`: `SSMClient = class { send = ssmSend }`, `GetParametersCommand = vi.fn(function (input) { this.input = input; })`; `ssmSend` resolves `{ Parameters: [{ Name: '/stella/telegram/token', Value: 'TOKEN' }, { Name: '/stella/telegram/chat-id', Value: '42' }] }`.
- `vi.stubGlobal('fetch', fetchMock)` resolving `{ ok: true, json: async () => ({ ok: true }) }`.
- `process.env`: `TABLE_NAME=stella-leads`, `NOTIFY_EMAIL=leads@example.com`, `FROM_ADDRESS=noreply@example.com`, the two SSM names.
- Helper `event(body, extra = {})` → `{ body: typeof body === 'string' ? body : JSON.stringify(body), isBase64Encoded: false, requestContext: { http: { sourceIp: '1.2.3.4', userAgent: 'vitest' } }, ...extra }`.
- `validLead = { name: 'Ola', phone: '+47 900 00 000', car: 'Porsche 911', service: 'Package Correction', message: 'Hei', lang: 'en', website: '', page: 'https://example.com/' }`.

Tests:

```js
it('stores, emails and notifies a valid lead', ...)
  // 200, body {"ok":true}, headers['content-type'] === 'application/json'
  // ddbSend called once; PutCommand input: TableName 'stella-leads', Item.pk 'LEAD',
  //   Item.sk matches /^\d{4}-\d{2}-\d{2}T[^#]+#[0-9a-f-]{36}$/, Item.name 'Ola', Item.ip '1.2.3.4', Item.userAgent 'vitest'
  // sesSend called once; SendEmailCommand input: FromEmailAddress 'noreply@example.com',
  //   Destination.ToAddresses ['leads@example.com'], Content.Simple.Subject.Data 'New lead: Ola — Package Correction'
  // fetch called with 'https://api.telegram.org/botTOKEN/sendMessage', method POST,
  //   JSON body { chat_id: '42', text: expect.stringContaining('Ola') }
it('decodes a base64 body', ...)            // event(Buffer.from(JSON.stringify(validLead)).toString('base64'), { isBase64Encoded: true }) → 200, ddbSend called
it('short-circuits on the honeypot', ...)   // website: 'http://spam' → 200 {"ok":true}; ddbSend, sesSend, fetch not called
it('rejects invalid JSON', ...)             // event('{not json') → 400 {"ok":false,"error":"bad_request"}
it('rejects a body over 10 KB', ...)        // message of 11_000 chars → 400 bad_request (checked before parsing)
it.each([['phone', 'abc'], ['name', ''], ['name', 'x'.repeat(101)], ['message', 'x'.repeat(501)], ['lang', 'fr']])
  ('rejects invalid %s', ...)               // 400 {"ok":false,"error":"validation"}; ddbSend not called
it('returns 500 when DynamoDB fails', ...)  // ddbSend rejects → 500 {"ok":false,"error":"storage"}; sesSend and fetch not called
it('still succeeds when SES fails', ...)    // sesSend rejects → 200 ok; console.error called once
it('still succeeds when Telegram fails', ...) // fetch resolves { ok: false, status: 401 } → 200 ok; console.error called once
it('reads SSM parameters once per container', ...) // two handler calls → GetParametersCommand constructed once
```

Validation rules (exact): `name` 1–100 chars after trim; `phone` 5–30 chars, regex `/^[+\d\s()\-]+$/`; `car`, `service`, `page` ≤ 500; `message` ≤ 500; `lang` ∈ `no en de uk ru`; `website` must be empty (honeypot). Body limit 10 240 bytes measured on the raw (decoded) string.

- [ ] **Step 3: Run tests to verify they fail**

Run: `npm test -- infra/form`
Expected: FAIL, cannot find module `./src/handler.mjs`.

- [ ] **Step 4: Implement `infra/form/src/handler.mjs`**

Clients created at module scope (`DynamoDBDocumentClient.from(new DynamoDBClient({}))`, `new SESv2Client({})`, `new SSMClient({})`); `let telegram` cache filled by `GetParametersCommand({ Names: [token, chatId], WithDecryption: true })`. Message text (used for both email body and Telegram): lines `New lead`, `Name: …`, `Phone: …`, `Car: …`, `Service: …`, `Message: …`, `Lang: …`, `Page: …`. Order of work: size check → decode → parse → honeypot → validate → `PutCommand` → `Promise.allSettled([sendEmail(), sendTelegram()])` logging rejected results and non-ok Telegram responses with `console.error` → 200. `sk = `${new Date().toISOString()}#${crypto.randomUUID()}``.

- [ ] **Step 5: Run tests, lint**

Run: `npm test -- infra/form && npm run lint`
Expected: all handler tests pass; lint exit 0.

- [ ] **Step 6: Commit**

```bash
git add infra/form package.json package-lock.json eslint.config.js
git commit -m "Lambda-обробник заявок: валідація, DynamoDB, SES, Telegram (TDD)"
```

---

### Task 6: `stella-form` stack

**Files:**

- Create: `infra/form.yaml`, `infra/params/form.example.json`, `infra/params/form.json` (ignored)
- Modify: `infra/README.md`

**Interfaces:**

- Consumes: `infra/form/src/handler.mjs` (Task 5), `HostedZoneId`, `$DOMAIN`.
- Produces: output `ApiUrl` = `https://api.$DOMAIN/lead`, consumed by Tasks 7–8.

- [ ] **Step 1: One-time secrets and SES verification (owner supplies values via environment variables, never pasted into files)**

```bash
aws ssm put-parameter --region eu-north-1 --name /stella/telegram/token --type SecureString --value "$TELEGRAM_TOKEN"
aws ssm put-parameter --region eu-north-1 --name /stella/telegram/chat-id --type SecureString --value "$TELEGRAM_CHAT_ID"
aws sesv2 create-email-identity --region eu-north-1 --email-identity "$NOTIFY_EMAIL"
```

Owner clicks the SES verification link. Verify: `aws sesv2 get-email-identity --region eu-north-1 --email-identity "$NOTIFY_EMAIL" --query VerifiedForSendingStatus` → `true`.

- [ ] **Step 2: Write `infra/form.yaml`**

Parameters: `DomainName`, `HostedZoneId`, `NotifyEmail`, `AllowedOrigin` (`https://<domain>`, required), `FromLocalPart` (default `noreply`), `TelegramTokenParam` (default `/stella/telegram/token`), `TelegramChatIdParam` (default `/stella/telegram/chat-id`).

Resources:

- `ApiCertificate` — regional ACM for `api.${DomainName}`, DNS validation via `HostedZoneId`.
- `LeadsTable` — `TableName: stella-leads`, `PAY_PER_REQUEST`, keys `pk` (HASH, S) + `sk` (RANGE, S), PITR enabled, `DeletionPolicy: Retain`, `UpdateReplacePolicy: Retain`.
- `EmailIdentity` — `AWS::SES::EmailIdentity` for `DomainName`, DKIM signing enabled, `RSA_2048_BIT`; `Dkim1`, `Dkim2`, `Dkim3` CNAME records from `DkimDNSTokenName1..3` / `DkimDNSTokenValue1..3`, TTL 1800.
- `LogGroup` — `/aws/lambda/stella-lead-handler`, retention 14.
- `HandlerRole` — managed `AWSLambdaBasicExecutionRole`; inline: `dynamodb:PutItem` on the table ARN; `ses:SendEmail` on `arn:aws:ses:${AWS::Region}:${AWS::AccountId}:identity/${DomainName}`; `ssm:GetParameters` on the two parameter ARNs (`arn:aws:ssm:${AWS::Region}:${AWS::AccountId}:parameter${TelegramTokenParam}`); `kms:Decrypt` on `*` with condition `kms:ViaService = ssm.${AWS::Region}.amazonaws.com`.
- `Handler` — `FunctionName: stella-lead-handler`, `Runtime: nodejs22.x`, `Architectures: [arm64]`, `Handler: handler.handler`, `MemorySize: 256`, `Timeout: 10`, `Code: ./form/src`, environment: `TABLE_NAME`, `NOTIFY_EMAIL`, `FROM_ADDRESS: !Sub '${FromLocalPart}@${DomainName}'`, `TELEGRAM_TOKEN_PARAM`, `TELEGRAM_CHAT_ID_PARAM`; `DependsOn: LogGroup`.
- `Api` — HTTP, `Name: stella-form`, CORS `AllowOrigins [AllowedOrigin]`, `AllowMethods [POST, OPTIONS]`, `AllowHeaders [content-type]`, `MaxAge 86400`.
- `Integration` (`AWS_PROXY`, payload `2.0`), `Route` (`POST /lead`), `Stage` (`$default`, `AutoDeploy`, `DefaultRouteSettings` rate 5 / burst 10), `InvokePermission` (`apigateway.amazonaws.com`, source `arn:aws:execute-api:${AWS::Region}:${AWS::AccountId}:${Api}/*/*/lead`).
- `ApiDomain` (`api.${DomainName}`, REGIONAL, TLS_1_2, `ApiCertificate`), `ApiMapping`, `ApiA` + `ApiAAAA` alias records using `RegionalDomainName` / `RegionalHostedZoneId`.
- `AlarmTopic` (email subscription `NotifyEmail`), `ErrorAlarm` (Lambda `Errors`, Sum, 300 s, 1 period, ≥ 1, `notBreaching`).

Outputs: `ApiUrl`, `TableName`, `FunctionName`.

- [ ] **Step 3: Lint, package, deploy**

```bash
cfn-lint infra/form.yaml
aws s3api head-bucket --bucket "stella-cfn-artifacts-$ACCOUNT" 2>/dev/null || aws s3 mb "s3://stella-cfn-artifacts-$ACCOUNT" --region eu-north-1
aws cloudformation package --region eu-north-1 --template-file infra/form.yaml --s3-bucket "stella-cfn-artifacts-$ACCOUNT" --output-template-file "$SCRATCH/form.packaged.yaml"
aws cloudformation deploy --region eu-north-1 --stack-name stella-form --template-file "$SCRATCH/form.packaged.yaml" --parameter-overrides file://infra/params/form.json --capabilities CAPABILITY_IAM
```

Expected: success. Owner confirms the SNS subscription email.

- [ ] **Step 4: Verify end to end**

```bash
API=$(aws cloudformation describe-stacks --region eu-north-1 --stack-name stella-form --query 'Stacks[0].Outputs[?OutputKey==`ApiUrl`].OutputValue' --output text)
curl -s -D - -o /dev/null -X OPTIONS "$API" -H "Origin: https://$DOMAIN" -H 'Access-Control-Request-Method: POST' | grep -iE '^(HTTP|access-control-allow-origin)'
curl -s -X POST "$API" -H 'content-type: application/json' -d '{"name":"Test","phone":"+47 900 00 000","car":"Test car","service":"Package Gloss","message":"deploy check","lang":"en","website":"","page":"curl"}'
curl -s -X POST "$API" -H 'content-type: application/json' -d '{"name":"Bot","phone":"abc","lang":"en"}'
aws dynamodb scan --region eu-north-1 --table-name stella-leads --select COUNT --query Count
aws sesv2 get-email-identity --region eu-north-1 --email-identity "$DOMAIN" --query 'DkimAttributes.Status'
```

Expected: preflight `HTTP/2 204` with `access-control-allow-origin: https://$DOMAIN`; first POST `{"ok":true}`; second `{"ok":false,"error":"validation"}`; count `1`; DKIM `SUCCESS` (may take up to an hour; if `PENDING`, re-check later, the email still sends once verified). Owner confirms the email and the Telegram message arrived.

- [ ] **Step 5: Commit**

```bash
git add infra/form.yaml infra/params/form.example.json infra/README.md
git commit -m "CloudFormation: HTTP API + Lambda + DynamoDB + SES + Telegram для форми"
```

---

### Task 7: Contact form posts to the API (TDD)

**Files:**

- Modify: `src/components/Contact.jsx`, `src/i18n/{no,en,de,uk,ru}.js` (`contact.form.error`, `contact.form.sending`)
- Create: `src/components/Contact.test.jsx`, `.env.example`

**Interfaces:**

- Consumes: `renderWithProviders` (`src/test/render.jsx`), `import.meta.env.VITE_API_URL`.
- Produces: JSON body `{ name, phone, car, service, message, lang, website, page }` matching Task 5's `validate`.

- [ ] **Step 1: Add the i18n keys (exact copy)**

| lang | `contact.form.error`                                                       | `contact.form.sending` |
| ---- | -------------------------------------------------------------------------- | ---------------------- |
| no   | `Noe gikk galt. Ring oss eller prøv igjen.`                                | `Sender…`              |
| en   | `Something went wrong. Please call us or try again.`                       | `Sending…`             |
| de   | `Etwas ist schiefgelaufen. Rufen Sie uns an oder versuchen Sie es erneut.` | `Wird gesendet…`       |
| uk   | `Щось пішло не так. Зателефонуйте нам або спробуйте ще раз.`               | `Надсилаємо…`          |
| ru   | `Что-то пошло не так. Позвоните нам или попробуйте ещё раз.`               | `Отправляем…`          |

Run: `npm test -- src/i18n/structure.test.js` → PASS (all five updated).

- [ ] **Step 2: Write the failing tests `src/components/Contact.test.jsx`**

Setup: `vi.stubEnv('VITE_API_URL', 'https://api.test/lead')` in `beforeEach`, `vi.unstubAllEnvs()` in `afterEach`; `fetchMock = vi.fn()`, `vi.stubGlobal('fetch', fetchMock)`; `renderWithProviders(<Contact />, { lang: 'en' })`; `user = userEvent.setup()`. Fill via `screen.getByLabelText(/^name/i)` → `Ola`, `screen.getByLabelText(/^phone/i)` → `+47 900 00 000`; submit via `screen.getByRole('button', { name: 'Send request' })`.

```js
it('posts the lead as JSON and shows success', ...)
  // fetchMock resolves { ok: true, json: async () => ({ ok: true }) }
  // fetchMock called once with 'https://api.test/lead' and { method: 'POST', headers: { 'content-type': 'application/json' }, body: <string> }
  // JSON.parse(body) toEqual { name: 'Ola', phone: '+47 900 00 000', car: '', service: '', message: '', lang: 'en', website: '', page: window.location.href }
  // await screen.findByText('Thank you! We will contact you shortly.')
  // name input value is '' (form reset)
it('shows the error message and keeps the input on a server error', ...)
  // fetchMock resolves { ok: false, status: 500 } → findByText('Something went wrong. Please call us or try again.'); name input value still 'Ola'
it('shows the error message when fetch rejects', ...)
  // fetchMock rejects new Error('network') → same error text
it('disables the button and shows Sending… while pending', ...)
  // fetchMock returns new Promise(() => {}) → button is disabled, has text 'Sending…', fetchMock called once even after a second click
it('falls back to local success when VITE_API_URL is empty', ...)
  // vi.stubEnv('VITE_API_URL', '') → fetchMock not called; success text visible
it('includes the honeypot field, hidden from users', ...)
  // document.querySelector('input[name="website"]') not null and has attribute aria-hidden 'true'
```

- [ ] **Step 3: Run to verify failure**

Run: `npm test -- src/components/Contact.test.jsx`
Expected: FAIL (no fetch call, no "Sending…").

- [ ] **Step 4: Implement in `Contact.jsx`**

State `status` ∈ `idle | sending | sent | error`. Read `const apiUrl = import.meta.env.VITE_API_URL || ''` inside `onSubmit` (not at module scope, so `vi.stubEnv` in tests takes effect). `onSubmit`: build the payload from `FormData` (`Object.fromEntries` plus `lang` from `useLang()` and `page: window.location.href`); if `apiUrl` is empty → reset and `sent`; else `sending`, `fetch`, `response.ok` → reset + `sent`, otherwise `error`; `catch` → `error`. Submit button `disabled={status === 'sending'}` with label `f.sending` while sending. Snackbar open when `sent` or `error`, `Alert severity` `success` or `error`, text `f.success` / `f.error`. Honeypot `<Box component="input" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" sx={{ position: 'absolute', left: -10000 }} />` inside the form.

- [ ] **Step 5: Create `.env.example`**

```
# URL of the lead endpoint (output ApiUrl of the stella-form stack). Leave empty for local demo mode.
VITE_API_URL=
```

- [ ] **Step 6: Run the suite, lint, build**

Run: `npm run lint && npm run format:check && npm test && npm run build`
Expected: green.

- [ ] **Step 7: Commit**

```bash
git add src/components/Contact.jsx src/components/Contact.test.jsx src/i18n/*.js .env.example
git commit -m "Форма заявки надсилає JSON на API, стани sending/error, honeypot"
```

---

### Task 8: CI/CD cutover to AWS

**Files:**

- Modify: `.github/workflows/deploy.yml`, `.github/workflows/ci.yml`

**Interfaces:**

- Consumes: `DeployRoleArn`, `BucketName`, `DistributionId` (Task 4), `ApiUrl` (Task 6).

- [ ] **Step 1: Update `deploy.yml`**

Keep the `if: vars.S3_BUCKET != ''` guard, OIDC permissions and concurrency. Build step gets `env: VITE_API_URL: ${{ vars.VITE_API_URL }}`. Upload step: `sync` excludes `index.html` and `favicon.svg`; then two `cp` commands with `--cache-control no-cache` for both. Invalidation paths `/index.html /favicon.svg /`.

- [ ] **Step 2: Add template lint to `ci.yml`**

After `npm run build`: `pip install cfn-lint` then `cfn-lint infra/*.yaml`.

- [ ] **Step 3: Set repository variables and secret**

```bash
gh variable set AWS_REGION -b eu-north-1
gh variable set S3_BUCKET -b "$BUCKET"
gh variable set CLOUDFRONT_DISTRIBUTION_ID -b "$(aws cloudformation describe-stacks --region eu-north-1 --stack-name stella-site --query 'Stacks[0].Outputs[?OutputKey==`DistributionId`].OutputValue' --output text)"
gh variable set VITE_API_URL -b "$API"
gh secret set AWS_ROLE_ARN -b "$(aws cloudformation describe-stacks --region eu-north-1 --stack-name stella-site --query 'Stacks[0].Outputs[?OutputKey==`DeployRoleArn`].OutputValue' --output text)"
```

- [ ] **Step 4: Commit, push, watch**

```bash
git add .github/workflows/deploy.yml .github/workflows/ci.yml
git commit -m "Деплой на AWS з GitHub Actions: VITE_API_URL, no-cache для favicon, cfn-lint у CI"
git push
gh run watch --exit-status $(gh run list --workflow "Deploy to AWS" --limit 1 --json databaseId -q '.[0].databaseId')
```

Expected: `success`.

- [ ] **Step 5: Verify**

```bash
curl -sI "https://$DOMAIN/" | grep -i '^cache-control'
curl -s "https://$DOMAIN/" | grep -o 'assets/index-[A-Za-z0-9_-]*\.js'
```

Expected: `cache-control: no-cache`; the asset hash equals the one in the workflow's build log (`dist/assets/index-*.js`). Owner submits a real lead from the live site; email and Telegram arrive.

---

### Task 9: Switch off GitHub Pages

**Files:**

- Delete: `.github/workflows/pages.yml`
- Modify: `vite.config.js` (`base: '/'`, remove the `BASE_PATH` comment)

- [ ] **Step 1: Remove the workflow and the base-path switch**, run `npm run build && npm test` → green.

- [ ] **Step 2: Disable Pages**

Run: `gh api -X DELETE repos/phobossupport-coder/landing-car-cleaning/pages`
Expected: HTTP 204.

- [ ] **Step 3: Commit and push**

```bash
git add -A
git commit -m "Вимкнення GitHub Pages: лише AWS"
git push
```

Expected: `CI` and `Deploy to AWS` runs succeed; no `Deploy to GitHub Pages` run.

- [ ] **Step 4: Verify**

Run: `curl -s -o /dev/null -w '%{http_code}\n' https://phobossupport-coder.github.io/landing-car-cleaning/`
Expected: `404` (may lag a few minutes).

---

### Task 10: Runbook and documentation cleanup

**Files:**

- Create: `docs/deploy-runbook.md`
- Delete: `DEPLOY.md`
- Modify: `README.md`, `CLAUDE.md` (Deployment section), `infra/README.md`

- [ ] **Step 1: Write `docs/deploy-runbook.md`** (English) with sections: Overview (diagram of the three stacks), Prerequisites (`aws login`, Node 22, `cfn-lint`), Parameter files (how to recreate the ignored `infra/params/*.json` from stack outputs), Deploy order (the exact `deploy`/`package` commands from Tasks 3, 4, 6), Site deploy (CI; manual `s3 sync` fallback from Task 4 Step 3), Rotating the Telegram token (`put-parameter --overwrite`, then `aws lambda update-function-configuration --function-name stella-lead-handler --description "rotated $(date -I)"` to force new containers), Rollback (`aws s3api list-object-versions` + copy the previous `index.html`; or re-run the last green workflow), Troubleshooting (`aws cloudformation describe-stack-events --stack-name … --max-items 20`, `aws logs tail /aws/lambda/stella-lead-handler --follow`), Destroy (empty bucket, delete `stella-form`, `stella-site`, `stella-certificate`; `stella-leads` is retained on purpose), Identifiers (table with stack names, bucket, distribution id, API URL; no account id).

- [ ] **Step 2: Delete `DEPLOY.md`; update `README.md` links; in `CLAUDE.md` replace the "created by the AWS deployment plan" marker with plain links; finish `infra/README.md`.**

- [ ] **Step 3: Verify and commit**

Run: `npm run lint && npm run format:check && npm test && npm run build`

```bash
git add -A
git commit -m "Runbook деплою, видалення застарілого DEPLOY.md"
git push
```

Expected: CI green. Done.
