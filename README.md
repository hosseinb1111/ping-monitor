# Browser Network Monitor

A lightweight, single-file browser network monitoring dashboard built with **HTML, CSS, SVG, and vanilla JavaScript**.

It measures approximate HTTP latency directly from the user's browser to several popular internet services and visualizes the results as an animated network map.

## Features

- Browser-side latency testing
- No backend required for the monitoring logic
- Animated SVG network visualization
- Popular services included:
  - Cloudflare
  - Google
  - GitHub
  - Discord
  - Wikipedia
  - Microsoft
  - Apple
  - Amazon
  - OpenAI
- Live latency values
- Online/offline/slow visual states
- Average latency
- Fastest connection
- Online service count
- Last-check timestamp
- Start/Pause monitoring button
- Automatic checks every 5 seconds
- Responsive layout for desktop and mobile
- Everything contained in a single `index.html`

## How It Works

The monitoring runs directly inside the visitor's browser.

The basic flow is:

```text
User's Browser
      |
      +----> Cloudflare
      |
      +----> Google
      |
      +----> GitHub
      |
      +----> Discord
      |
      +----> Wikipedia
      |
      +----> Microsoft
      |
      +----> Apple
      |
      +----> Amazon
      |
      +----> OpenAI
```

JavaScript records the time immediately before an HTTP request and calculates the elapsed time after the request completes.

Conceptually:

```js
const start = performance.now();

await fetch(url, {
    mode: "no-cors",
    cache: "no-store"
});

const latency = performance.now() - start;
```

This means the test is performed from the **user's connection**, rather than from the Cloudflare Worker or hosting server.

## Important: This Is Not ICMP Ping

Normal browser JavaScript cannot send raw ICMP packets.

Therefore, this project does **not** perform the same type of ping as:

```bash
ping google.com
```

Instead, it measures approximate **HTTP request latency**.

For a web application, this can actually be useful because it is closer to the kind of network request a real website visitor makes.

However, the result can be affected by:

- DNS resolution
- TCP/TLS connection setup
- HTTP connection reuse
- Browser behavior
- Cache behavior
- Extensions
- Firewall rules
- VPNs
- Proxies
- ISP routing
- The target website's infrastructure
- CORS/security restrictions

Therefore, the displayed number should be treated as an approximate browser-to-service latency measurement rather than a precise network ping.

## Status Thresholds

The current implementation uses these thresholds:

| Latency | Status |
|---|---|
| `< 120 ms` | Online / Fast |
| `120–299 ms` | Slow |
| `>= 300 ms` | Very slow |
| Request failure | Timeout |

These values can easily be changed in the JavaScript:

```js
if (latency < 120) {
    node.classList.add("online");

} else if (latency < 300) {
    node.classList.add("slow");

} else {
    node.classList.add("offline");
}
```

## Monitoring Interval

The dashboard performs a new test every **5 seconds**.

The interval is controlled by:

```js
monitorTimer = setInterval(
    pingAll,
    5000
);
```

To check every 10 seconds:

```js
monitorTimer = setInterval(
    pingAll,
    10000
);
```

To check every 2 seconds:

```js
monitorTimer = setInterval(
    pingAll,
    2000
);
```

Be careful with very short intervals because this can generate a lot of requests from the user's browser.

## Start / Pause

The dashboard has a monitoring toggle.

When monitoring is active:

```text
Ⅱ Pause
● LIVE MONITORING
```

When paused:

```text
▶ Start
● MONITORING PAUSED
```

Pausing stops the automatic monitoring interval while keeping the last measured values visible.

Starting monitoring again immediately performs a new check and resumes the 5-second interval.

## Adding Another Website

The targets are defined in one JavaScript object:

```js
const targets = {

    cloudflare:
        "https://www.cloudflare.com/cdn-cgi/trace",

    google:
        "https://www.google.com/favicon.ico",

    github:
        "https://github.com/favicon.ico"
};
```

To add another target, add another entry:

```js
const targets = {

    cloudflare:
        "https://www.cloudflare.com/cdn-cgi/trace",

    google:
        "https://www.google.com/favicon.ico",

    github:
        "https://github.com/favicon.ico",

    example:
        "https://example.com/favicon.ico"
};
```

You would also need to create a corresponding SVG node with:

```html
<g id="node-example">
    ...
</g>
```

and a latency element:

```html
<text
    class="site-ping"
    x="..."
    y="..."
    id="ping-example"
>
    --
</text>
```

## Deployment

Because the project is completely client-side, it can be hosted on many static hosting services.

For Cloudflare Workers, the basic structure can simply be:

```text
project/
└── index.html
```

The browser downloads `index.html`, and the JavaScript inside it performs the monitoring.

No database or API server is required for the basic functionality.

## Privacy

The latency requests are made from the visitor's browser directly to the configured services.

The project itself does not need to send the latency results to your server.

In other words:

```text
Visitor
   |
   +---- HTTP request ----> Target website
   |
   +---- HTTP request ----> Another target
```

rather than:

```text
Visitor
   |
   v
Your server / Worker
   |
   v
Target website
```

This makes the measurements representative of the visitor's network path.

## Limitations

### CORS

The project uses:

```js
mode: "no-cors"
```

because many websites do not allow arbitrary origins to read their responses.

With `no-cors`, JavaScript cannot inspect the response body or normal HTTP response details.

The application mainly uses the request completion time.

### A Timeout Does Not Necessarily Mean the Website Is Down

A target can fail to respond to the browser because of:

- CORS/security policies
- Network filtering
- DNS problems
- VPN configuration
- Browser extensions
- Firewall rules
- Temporary routing problems

Therefore:

```text
TIMEOUT ≠ Website definitely offline
```

It means that the browser could not successfully complete the particular request used by the test.

## Possible Future Improvements

The current version is intentionally simple, but it can be expanded considerably.

### More Accurate Measurements

Instead of one request per check, perform multiple samples:

```text
Sample 1: 42 ms
Sample 2: 39 ms
Sample 3: 45 ms
Sample 4: 41 ms
Sample 5: 43 ms
```

Then calculate:

- Minimum
- Maximum
- Average
- Median
- Jitter
- Packet/request loss

### Historical Graph

Keep recent measurements:

```text
Time
 |
 |        ╭──╮
 |    ╭───╯  ╰──╮
 |────╯         ╰────
 |
 +----------------------> latency
```

This would make temporary spikes much easier to identify.

### Request Loss

For example:

```text
Requests: 20
Successful: 18
Failed: 2

Loss: 10%
```

This is more informative than simply showing `TIMEOUT`.

### Geographic Testing

A more advanced version could compare:

- User → Cloudflare
- User → Europe
- User → US
- User → Asia
- User → Middle East

However, that requires carefully selected endpoints or infrastructure in those regions.

### Cloudflare Edge Information

If hosted through Cloudflare, the application could also display information from Cloudflare's trace endpoint, such as the Cloudflare edge/colo handling the request.

That would allow the dashboard to show something like:

```text
Your Browser
     |
     v
Cloudflare Edge
     |
     +--- FRA
     |
     v
Internet
```

## File Structure

The current version intentionally uses only one file:

```text
network-monitor/
└── index.html
```

The file contains:

```text
HTML
 ├── Header
 ├── Controls
 ├── SVG network
 └── Statistics

CSS
 ├── Layout
 ├── Dark theme
 ├── SVG styling
 ├── Animations
 ├── Status states
 └── Responsive design

JavaScript
 ├── Target configuration
 ├── Browser-side ping
 ├── Statistics
 ├── Start/Pause control
 └── Monitoring interval
```

## License

You can modify the project for your own website or personal projects.

If you distribute a modified version, consider adding your own project name, attribution, and license terms.

---

## Quick Start

1. Create a file named:

```text
index.html
```

2. Put the complete HTML/CSS/JavaScript implementation into it.

3. Open it in a browser.

4. The monitoring starts automatically.

5. Use **Pause** to stop automatic checks.

6. Use **Start** to resume monitoring.

7. Deploy the same `index.html` to your preferred static host or Cloudflare Worker.
