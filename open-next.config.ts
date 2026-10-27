import { defineCloudflareConfig } from "@opennextjs/cloudflare";

// No incremental cache: every page is a client component, so there is no ISR data to store.
export default defineCloudflareConfig({});
