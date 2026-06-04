"use client";
import { useEffect, useState } from "react";
import {
  Page,
  Card,
  Text,
  Grid,
  Badge,
  Spinner,
  BlockStack,
  InlineStack,
  Divider,
} from "@shopify/polaris";
import { supabase } from "../../lib/supabase";
import { AnalyticsEvent } from "../../types/Product";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

const COLORS = [
  "#008060",
  "#4ba3c3",
  "#f59e0b",
  "#ef4444",
  "#8b5cf6",
  "#ec4899",
];

export default function Dashboard() {
  const [events, setEvents] = useState<AnalyticsEvent[]>([]);
  const [insight, setInsight] = useState("");
  const [loadingInsight, setLoadingInsight] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      const { data } = await supabase
        .from("events")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(500);
      setEvents(data || []);
      setLoading(false);
      if (data && data.length > 0) {
        fetchInsight(data);
      } else {
        setInsight(
          "No events yet — visit the product page and click some products first!",
        );
        setLoadingInsight(false);
      }
    }
    fetchData();
  }, []);

  async function fetchInsight(data: AnalyticsEvent[]) {
    setLoadingInsight(true);
    try {
      const topProducts = getTopProducts(data).slice(0, 5);
      const totalSessions = new Set(data.map((e) => e.session_id)).size;
      const analyticsData = {
        totalEvents: data.length,
        totalSessions,
        topProducts,
      };
      const res = await fetch("/api/ai-insight", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ analyticsData }),
      });
      const json = await res.json();
      setInsight(json.insight || "No insight generated.");
    } catch (err) {
      setInsight("AI insight unavailable — check your Anthropic API key.");
    } finally {
      setLoadingInsight(false);
    }
  }

  function getTopProducts(data: AnalyticsEvent[]) {
    const counts: Record<string, number> = {};
    data
      .filter((e) => e.product_name)
      .forEach((e) => {
        const name = e.product_name!.substring(0, 20) + "...";
        counts[name] = (counts[name] || 0) + 1;
      });
    return Object.entries(counts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);
  }

  function getCategoryData(data: AnalyticsEvent[]) {
    const counts: Record<string, number> = {};
    data
      .filter((e) => e.product_category)
      .forEach((e) => {
        counts[e.product_category!] = (counts[e.product_category!] || 0) + 1;
      });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }

  function getEventCounts(data: AnalyticsEvent[]) {
    const counts: Record<string, number> = {};
    data.forEach((e) => {
      counts[e.event] = (counts[e.event] || 0) + 1;
    });
    return Object.entries(counts).map(([name, count]) => ({ name, count }));
  }

  const totalSessions = new Set(events.map((e) => e.session_id)).size;
  const modalOpens = events.filter((e) => e.event === "modal_open").length;
  const topProducts = getTopProducts(events);
  const categoryData = getCategoryData(events);
  const eventCounts = getEventCounts(events);

  if (loading)
    return (
      <Page title="Analytics Dashboard">
        <div style={{ padding: 60, textAlign: "center" }}>
          <Spinner />
        </div>
      </Page>
    );

  return (
    <Page
      title="Analytics Dashboard"
      subtitle="How users interact with your product store"
      backAction={{ content: "Products", url: "/" }}
    >
      <BlockStack gap="500">
        <Card>
          <BlockStack gap="300">
            <InlineStack align="space-between">
              <Text variant="headingMd" as="h2">
                🤖 Claude AI Insight
              </Text>
              <Badge tone="magic">Powered by Claude</Badge>
            </InlineStack>
            {loadingInsight ? (
              <InlineStack gap="200">
                <Spinner size="small" />
                <Text as="p" tone="subdued">
                  Analyzing user behavior...
                </Text>
              </InlineStack>
            ) : (
              <Text as="p">{insight}</Text>
            )}
          </BlockStack>
        </Card>

        <Grid>
          <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 3, xl: 3 }}>
            <Card>
              <BlockStack gap="200">
                <Text as="p" tone="subdued">
                  Total Events
                </Text>
                <Text variant="heading2xl" as="h3">
                  {events.length}
                </Text>
              </BlockStack>
            </Card>
          </Grid.Cell>
          <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 3, xl: 3 }}>
            <Card>
              <BlockStack gap="200">
                <Text as="p" tone="subdued">
                  Unique Sessions
                </Text>
                <Text variant="heading2xl" as="h3">
                  {totalSessions}
                </Text>
              </BlockStack>
            </Card>
          </Grid.Cell>
          <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 3, xl: 3 }}>
            <Card>
              <BlockStack gap="200">
                <Text as="p" tone="subdued">
                  Modal Opens
                </Text>
                <Text variant="heading2xl" as="h3">
                  {modalOpens}
                </Text>
              </BlockStack>
            </Card>
          </Grid.Cell>
          <Grid.Cell columnSpan={{ xs: 6, sm: 3, md: 3, lg: 3, xl: 3 }}>
            <Card>
              <BlockStack gap="200">
                <Text as="p" tone="subdued">
                  Products Clicked
                </Text>
                <Text variant="heading2xl" as="h3">
                  {topProducts.length}
                </Text>
              </BlockStack>
            </Card>
          </Grid.Cell>
        </Grid>

        <Grid>
          <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 6, xl: 6 }}>
            <Card>
              <BlockStack gap="400">
                <Text variant="headingMd" as="h2">
                  Top clicked products
                </Text>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={topProducts.slice(0, 7)}>
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="count" fill="#008060" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </BlockStack>
            </Card>
          </Grid.Cell>
          <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 3, xl: 3 }}>
            <Card>
              <BlockStack gap="400">
                <Text variant="headingMd" as="h2">
                  By category
                </Text>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={categoryData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {categoryData.map((_, i) => (
                        <Cell key={i} fill={COLORS[i % COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend />
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </BlockStack>
            </Card>
          </Grid.Cell>
          <Grid.Cell columnSpan={{ xs: 6, sm: 6, md: 6, lg: 3, xl: 3 }}>
            <Card>
              <BlockStack gap="400">
                <Text variant="headingMd" as="h2">
                  Event breakdown
                </Text>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={eventCounts} layout="vertical">
                    <XAxis type="number" />
                    <YAxis
                      dataKey="name"
                      type="category"
                      tick={{ fontSize: 11 }}
                      width={100}
                    />
                    <Tooltip />
                    <Bar dataKey="count" fill="#4ba3c3" radius={[0, 4, 4, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </BlockStack>
            </Card>
          </Grid.Cell>
        </Grid>

        <Card>
          <BlockStack gap="400">
            <Text variant="headingMd" as="h2">
              Recent events
            </Text>
            <Divider />
            {events.length === 0 ? (
              <Text as="p" tone="subdued">
                No events yet — go to the product page and click some products!
              </Text>
            ) : (
              events.slice(0, 10).map((e) => (
                <InlineStack key={e.id} align="space-between">
                  <InlineStack gap="300">
                    <Badge tone={e.event === "modal_open" ? "success" : "info"}>
                      {e.event}
                    </Badge>
                    <Text as="span">
                      {e.product_name?.substring(0, 35) ?? "General"}
                    </Text>
                  </InlineStack>
                  <Text as="span" tone="subdued">
                    {new Date(e.created_at).toLocaleTimeString()}
                  </Text>
                </InlineStack>
              ))
            )}
          </BlockStack>
        </Card>
      </BlockStack>
    </Page>
  );
}
