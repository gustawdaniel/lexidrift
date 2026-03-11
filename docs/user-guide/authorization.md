# Authorization

To authorize a user we are using:

- Google Auth
- WebAuthn

## Google Auth

We are asking google for your:
- email
- full name
- avatar

## WebAuthn

In case of WebAuthn you can give us:
- email
- full name

Avatar is created from your full nane firs letters.

You can read more about WebAuthn [here](https://webauthn.guide/).

Our implementation is based on [passwordless-id/webauthn](https://webauthn.passwordless.id/).

But this standard is still relatively new, and you can experience some Browser compatibility issues described in [browser-quirks](https://simplewebauthn.dev/docs/advanced/browser-quirks)

List of supported devices: [Device Support](https://passkeys.dev/device-support/)

