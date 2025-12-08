# Playwright API Test Framework

## Overview
This repository contains a Playwright-based API testing framework. It is designed to test RESTful APIs with features like request handling, schema validation, and environment-based configurations.

## Project Structure
```
api-test.config.ts       # Configuration file for API tests
package.json             # Project dependencies and scripts
playwright.config.ts     # Playwright configuration
helpers/                 # Helper functions
request-objects/         # JSON files for request payloads
response-schemas/        # JSON schemas for response validation
tests/                   # Test files
utils/                   # Utility functions (e.g., request handler, schema validator)
```

## Prerequisites
- Node.js (v16 or higher)
- npm or yarn

## Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/PaskoM/playwright-api-test-framework.git
   ```
2. Navigate to the project directory:
   ```bash
   cd playwright-api-test-framework
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

## Environment Variables
Create a `.env` file in the root directory and add the following variables:
```
PROD_USERNAME=your_prod_email@example.com
PROD_PASSWORD=your_prod_password
```

## Running Tests
- Run all tests:
  ```bash
  npx playwright test
  ```
- Run tests in a specific file:
  ```bash
  npx playwright test tests/<test-file>.spec.ts
  ```
- Run tests in a specific environment:
  ```bash
  TEST_ENV=prod npx playwright test
  ```

## Features
- **Fixtures**: Custom fixtures for API request handling.
- **Schema Validation**: Validate API responses against predefined JSON schemas.
- **Environment Configurations**: Easily switch between environments (e.g., dev, prod).

## Folder Details
- **`helpers/`**: Contains utility functions to assist with test execution.
- **`request-objects/`**: Stores JSON files for request payloads.
- **`response-schemas/`**: Stores JSON schemas for validating API responses.
- **`tests/`**: Contains test files written in Playwright.
- **`utils/`**: Includes reusable utilities like request handlers and schema validators.

## Debugging
- Use the `console.log` statements to debug tests.
- Check the Playwright HTML report for detailed test results:
  ```bash
  npx playwright show-report
  ```

## Contributing
Feel free to submit issues or pull requests to improve the framework.

## License
This project is licensed under the MIT License.
