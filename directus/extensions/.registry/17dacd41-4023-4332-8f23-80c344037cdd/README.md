# The Action Button

> The action button allows you to run API calls inside your Directus Insights
> dashboard.

## Usage

The action button can be configured in two flavours: as a **button**, or as an
**aggregator**. The latter will run the same API endpoint, accept it will be run
on mount instead of manually.

### The Button

The button has a small state machine which works as follows:

1. Call the API endpoint with the provided data such as the body, headers, etc.
2. Await for a response
3. Check for an HTTP OK message
4. If an OK is received, display a 'success' on the button, otherwise 'failed'
   will be displayed 
5. After 5 seconds by default, the button can be pressed again

The button comes with additional features:

- **Button label** — The label which will be displayed on the button.
- **Result Delay** — Change the delay after the button has received its
  response.

### The Aggregator

The aggregator comes with additonal presentation:

- **Metric** — provide a regex filter to access data from the return body.
- **Text Area** — print out the response body as is.

## Requirements

Make sure you have at least Directus 10.10.0 or higher installed.

- Directus 10.10.0+

## Installation

Refer to the Official Guide for details on installing the extension from the
Marketplace or manually.

Or

Search for `run-chart` in Directus Marketplace and install it.
