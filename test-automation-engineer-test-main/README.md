# Test automation engineer

This repository is a take-home test to assess how you work as a test automation engineer. The setup reflects skills needed in the day-to-day work of a test automation engineer at [Beequip](https://beequip.com).
We expect you to spend a maximum of **two hours** on this test. Don't worry when you run out of time, we would still like to see what you came up with!

## What to expect

### Debug a failing assertion

In the repository there is an existing end-to-end test the `request-lease` test, however, the test **fails on an assertion**.
Fix the failing test, so that the assertion succeeds. Some hints to help you:

- **Investigate** before jumping to conclusions: Read the codebase, logs, network requests and the application to understand what is going wrong and why.
- **Think beyond the code**: consider business logic and whether the intention of the test is correct.

During the technical interview we'll ask you to explain your approach.

### Add a new assertion

Within the domain of leasing increasing the down payment results in a lower monthly payment and vice versa.
Design data-driven assertions that check this relationship for the following down payment percentages:

- 5%
- 10%
- 15%

With every down payment percentage, the actual monthly payment should have a maximum delta of €15 from the expected monthly payment.

During the technical interview we'll ask you to explain your approach again.

## Prerequisites

You will need to have [Node.js](https://nodejs.org/) installed on your machine, we support the following versions:

- 20.20.2 (Maintenance LTS)
- 22.22.2 (Maintenance LTS)
- 24.14.1 (Active LTS)
- 25.8.2 (Current)

<details>
<summary>I'm using `asdf`</summary>
In case you're using [`asdf`](https://asdf-vm.com/guide/getting-started.html) to manage the Node.js runtime, you can just run `asdf install`.
</details>

## Getting started

The project uses [Playwright](https://playwright.dev/) for the end-to-end tests, install the dependencies:

```bash
npm install
```

After installing the dependencies, you can run the end-to-end tests:

```bash
# Run the tests
npx playwright test

# Or run with the Playwright UI
npx playwright test --ui
```

## Tips

- There is no single "correct" way to solve this. We care about how you fixed the assertion and designed the new assertion.
- You can use the browser, dev tools, and any part of the codebase to understand and fix the problem.
- You can use Google, Stack Overflow and LLM's, just like you would normally do.
