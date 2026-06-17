import {
  Body,
  Container,
  Head,
  Heading,
  Hr,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface ContactNotificationProps {
  name: string;
  email: string;
  subject?: string;
  message: string;
}

export function ContactNotification({
  name,
  email,
  subject,
  message,
}: ContactNotificationProps) {
  return (
    <Html>
      <Head />
      <Preview>New contact message from {name}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={heading}>New Contact Message</Heading>
          <Section>
            <Text style={label}>From</Text>
            <Text style={value}>
              {name} ({email})
            </Text>
            {subject && (
              <>
                <Text style={label}>Subject</Text>
                <Text style={value}>{subject}</Text>
              </>
            )}
            <Text style={label}>Message</Text>
            <Text style={value}>{message}</Text>
          </Section>
          <Hr style={hr} />
          <Text style={footer}>Sent from your portfolio contact form</Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily: "Inter, sans-serif",
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "40px 20px",
  borderRadius: "8px",
};

const heading = {
  color: "#0f172a",
  fontSize: "24px",
  fontWeight: "bold",
};

const label = {
  color: "#64748b",
  fontSize: "12px",
  fontWeight: "600",
  textTransform: "uppercase" as const,
  marginBottom: "4px",
};

const value = {
  color: "#334155",
  fontSize: "14px",
  lineHeight: "24px",
  marginTop: "0",
};

const hr = {
  borderColor: "#e2e8f0",
  margin: "20px 0",
};

const footer = {
  color: "#94a3b8",
  fontSize: "12px",
};
