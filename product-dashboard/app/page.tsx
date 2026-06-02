"use client";

import { Page, Card, Text } from "@shopify/polaris";

export default function Home() {
  return (
    <Page title="Products">
      <Card>
        <Text as="h2" variant="headingMd">
          Shopify Polaris is working 🚀
        </Text>
      </Card>
    </Page>
  );
}