import pandas as pd
from pathlib import Path


# ============================================================
# DATASET GENERATION
# ============================================================

invoice_templates = [
    "Invoice number {i} customer name billing address subtotal tax total amount due",
    "Tax invoice vendor details buyer details GST amount payment terms total payable {i}",
    "Commercial invoice seller buyer quantity rate amount subtotal tax grand total {i}",
    "Service invoice customer vendor service description amount tax payment due date {i}",
    "Invoice date billing address shipping address subtotal discount tax total {i}",
    "GST invoice supplier customer GSTIN taxable amount CGST SGST total payable {i}",
    "Invoice number seller information buyer information item quantity price total {i}",
    "Bill to customer vendor payment due subtotal tax balance payable {i}",
    "Sales invoice product quantity unit price discount subtotal tax total {i}",
    "Invoice receipt number vendor customer transaction amount payment due {i}",
]

receipt_templates = [
    "Receipt transaction number store purchase date items amount paid cash {i}",
    "Retail receipt product quantity price subtotal discount total paid {i}",
    "Payment receipt payment received customer amount date transaction number {i}",
    "Purchase receipt store items purchased quantity amount paid card {i}",
    "Cash receipt customer payment received amount change transaction {i}",
    "Card payment receipt merchant purchase date total amount card payment {i}",
    "Shopping receipt items purchased subtotal tax total payment received {i}",
    "Receipt thank you for your purchase items quantity price amount paid {i}",
    "Point of sale receipt product price discount total payment method {i}",
    "Purchase transaction receipt store date items total paid change {i}",
]

unknown_templates = [
    "Student education course subjects semester grades academic information {i}",
    "Employee name department joining date salary attendance details {i}",
    "Bank account balance transaction history account number statement {i}",
    "Job application education experience skills projects qualifications {i}",
    "Meeting agenda attendees discussion topics action items schedule {i}",
    "Project requirements milestones team members deadlines deliverables {i}",
    "University admission application student course department documents {i}",
    "Hotel reservation guest name check in check out room booking {i}",
    "Product specification technical details features dimensions requirements {i}",
    "Customer feedback product comments suggestions experience rating {i}",
]


def generate_samples(templates, label, count):
    samples = []

    for i in range(count):
        template = templates[i % len(templates)]
        text = template.format(i=i + 1)

        samples.append({
            "text": text,
            "label": label
        })

    return samples


# ============================================================
# KEEP ORIGINAL DATA
# ============================================================

DATA_PATH = Path("data/classification/documents.csv")

existing_df = pd.read_csv(DATA_PATH)


# ============================================================
# GENERATE NEW DATA
# ============================================================

new_invoice = generate_samples(
    invoice_templates,
    "invoice",
    40
)

new_receipt = generate_samples(
    receipt_templates,
    "receipt",
    40
)

new_unknown = generate_samples(
    unknown_templates,
    "unknown",
    40
)


new_df = pd.DataFrame(
    new_invoice + new_receipt + new_unknown
)


# ============================================================
# COMBINE ORIGINAL + NEW DATA
# ============================================================

final_df = pd.concat(
    [existing_df, new_df],
    ignore_index=True
)


# Remove exact duplicates
final_df = final_df.drop_duplicates(
    subset=["text"]
).reset_index(drop=True)


# ============================================================
# SAVE
# ============================================================

final_df.to_csv(
    DATA_PATH,
    index=False
)


# ============================================================
# REPORT
# ============================================================

print("\n========== DATASET UPDATED ==========\n")

print("Total samples:", len(final_df))

print("\nClass distribution:")

print(
    final_df["label"].value_counts()
)

print("\nDataset saved to:")
print(DATA_PATH)