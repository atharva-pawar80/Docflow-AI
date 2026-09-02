import random
import pandas as pd

random.seed(42)

OUTPUT_PATH = "data/classification/documents_v2.csv"


# ============================================================
# INVOICE DATA
# ============================================================

invoice_templates = [
    "Tax Invoice | Seller: {seller} | Buyer: {buyer} | Invoice No: {number} | Date: {date} | Subtotal: Rs {subtotal} | GST: Rs {tax} | Total: Rs {total}",
    
    "Commercial Invoice | Supplier: {seller} | Customer: {buyer} | Invoice ID: {number} | Quantity: {qty} | Unit Price: Rs {price} | Tax: Rs {tax} | Amount Payable: Rs {total}",
    
    "Service Invoice | Vendor: {seller} | Client: {buyer} | Service: {service} | Billing Date: {date} | Service Charge: Rs {subtotal} | GST: Rs {tax} | Total Due: Rs {total}",
    
    "GST Invoice | Supplier: {seller} | Customer: {buyer} | GSTIN: {gstin} | Invoice Date: {date} | Taxable Value: Rs {subtotal} | GST Amount: Rs {tax} | Total Amount: Rs {total}",
    
    "Sales Invoice | Seller: {seller} | Bill To: {buyer} | Product: {product} | Quantity: {qty} | Rate: Rs {price} | Discount: Rs {discount} | Tax: Rs {tax} | Net Amount: Rs {total}",
    
    "Invoice | Vendor: {seller} | Customer: {buyer} | Invoice Number: {number} | Payment Terms: Net 30 | Subtotal: Rs {subtotal} | Tax: Rs {tax} | Balance Due: Rs {total}",
    
    "Subscription Invoice | Provider: {seller} | Subscriber: {buyer} | Plan: {service} | Billing Period: {date} | Base Charge: Rs {subtotal} | GST: Rs {tax} | Amount Due: Rs {total}",
    
    "Utility Invoice | Service Provider: {seller} | Account Holder: {buyer} | Bill Date: {date} | Usage Charges: Rs {subtotal} | Taxes: Rs {tax} | Total Payable: Rs {total}",
    
    "Freelance Invoice | Consultant: {seller} | Client: {buyer} | Work: {service} | Invoice Ref: {number} | Professional Fee: Rs {subtotal} | Tax: Rs {tax} | Total: Rs {total}",
    
    "Purchase Invoice | Supplier: {seller} | Buyer: {buyer} | Order Ref: {number} | Items: {product} | Units: {qty} | Unit Cost: Rs {price} | Tax: Rs {tax} | Total Payable: Rs {total}",
]


# ============================================================
# RECEIPT DATA
# ============================================================

receipt_templates = [
    "Receipt | Store: {store} | Purchase Date: {date} | Items: {product} | Quantity: {qty} | Total Paid: Rs {total} | Payment Method: Cash",
    
    "Retail Receipt | Merchant: {store} | Date: {date} | Product: {product} | Price: Rs {price} | Tax: Rs {tax} | Amount Paid: Rs {total}",
    
    "POS Receipt | Store: {store} | Transaction: {number} | Items Purchased: {product} | Subtotal: Rs {subtotal} | Tax: Rs {tax} | Total: Rs {total} | Paid by Card",
    
    "Shopping Receipt | Shop: {store} | Purchase Date: {date} | Quantity: {qty} | Product: {product} | Amount: Rs {total} | Payment: UPI",
    
    "Cash Receipt | Merchant: {store} | Customer Payment Received | Product: {product} | Amount: Rs {total} | Change Returned: Rs {change}",
    
    "Card Payment Receipt | Merchant: {store} | Purchase Date: {date} | Transaction ID: {number} | Amount Paid: Rs {total} | Payment: Credit Card",
    
    "Restaurant Receipt | Restaurant: {store} | Date: {date} | Items: {product} | Subtotal: Rs {subtotal} | Tax: Rs {tax} | Total Bill: Rs {total}",
    
    "Fuel Receipt | Station: {store} | Date: {date} | Fuel Quantity: {qty} | Rate: Rs {price} | Total Paid: Rs {total} | Payment: Cash",
    
    "Pharmacy Receipt | Pharmacy: {store} | Purchase Date: {date} | Medicine: {product} | Amount: Rs {total} | Payment Received",
    
    "Purchase Receipt | Seller: {store} | Receipt No: {number} | Date: {date} | Items: {product} | Total Amount Paid: Rs {total}",
]


# ============================================================
# UNKNOWN DATA
# ============================================================

unknown_templates = [
    "Student Academic Record | Student: {name} | Course: {course} | Semester: {semester} | Grades: {grade}",
    
    "Employee Record | Employee: {name} | Department: {department} | Joining Date: {date} | Attendance: {attendance}",
    
    "Bank Account Statement | Account Holder: {name} | Account Number: {account} | Opening Balance: Rs {subtotal} | Closing Balance: Rs {total}",
    
    "Job Application | Applicant: {name} | Education: {education} | Experience: {experience} | Skills: {skills}",
    
    "Meeting Notes | Meeting Date: {date} | Attendees: {name} | Topics Discussed: {topic} | Action Items: {action}",
    
    "Project Requirements | Project: {project} | Objective: {objective} | Milestones: {milestone} | Team: {name}",
    
    "Hotel Reservation | Guest: {name} | Check In: {date} | Check Out: {date2} | Room: {room} | Booking Status: Confirmed",
    
    "Product Specification | Product: {product} | Features: {features} | Dimensions: {dimensions} | Technical Requirements: {requirements}",
    
    "Customer Feedback | Customer: {name} | Product: {product} | Experience: {experience} | Comments: {comment} | Rating: {rating}",
    
    "University Admission | Student: {name} | Program: {course} | Department: {department} | Admission Status: {status}",
    
    # Hard negatives
    "Payment Confirmation | Status: Completed | Amount: Rs {total} | Transaction Reference: {number} | Account Ending: {account4}",
    
    "Transaction Notification | Transaction Status: Successful | Amount: Rs {total} | Reference Number: {number} | Account: {account4}",
    
    "Purchase Order | Buyer: {buyer} | Supplier: {seller} | Order Number: {number} | Product: {product} | Quantity: {qty} | Delivery Date: {date}",
    
    "Quotation | Vendor: {seller} | Customer: {buyer} | Product: {product} | Quantity: {qty} | Estimated Price: Rs {total} | Valid Until: {date}",
    
    "Delivery Note | Supplier: {seller} | Customer: {buyer} | Delivery Reference: {number} | Items: {product} | Quantity: {qty} | Delivery Status: Completed",
    
    "Tax Notice | Tax Authority: {seller} | Taxpayer: {buyer} | Notice Reference: {number} | Tax Period: {date} | Amount Mentioned: Rs {total}",
    
    "Business Requirements | Customer Billing Workflow | Vendor Onboarding | Tax Calculation | Payment Automation | Requirements: {requirements}",
    
    "Project Report | Project: {project} | Budget: Rs {total} | Billing Workflow: {objective} | Payment Process: {action} | Status: {status}",
    
    "Shipping Document | Sender: {seller} | Receiver: {buyer} | Tracking Number: {number} | Package: {product} | Quantity: {qty} | Delivery Status: {status}",
    
    "Business Contract | Company A: {seller} | Company B: {buyer} | Contract Reference: {number} | Service: {service} | Agreement Status: {status}",
]


# ============================================================
# RANDOM VALUES
# ============================================================

names = [
    "Rahul Sharma", "Priya Patil", "Amit Joshi", "Neha Kulkarni",
    "Rohan Deshmukh", "Sneha Pawar", "Aditya Shah", "Anjali More"
]

companies = [
    "TechNova Pvt Ltd", "ABC Solutions", "Global Traders",
    "Bright Systems", "Nova Retail", "CloudWorks", "Metro Services"
]

products = [
    "Laptop", "Keyboard", "Monitor", "Printer",
    "Office Chair", "Software License", "Mobile Phone",
    "Stationery", "Headphones"
]

services = [
    "Software Development", "Consulting", "Cloud Hosting",
    "Technical Support", "Digital Marketing", "IT Services"
]

stores = [
    "Reliance Digital", "Metro Mart", "City Supermarket",
    "Fresh Store", "Tech Shop", "Local Pharmacy"
]

departments = [
    "Engineering", "HR", "Finance", "Marketing",
    "Sales", "Operations"
]

courses = [
    "Computer Engineering", "AI and Data Science",
    "Information Technology", "Business Administration"
]

skills = [
    "Python SQL Machine Learning",
    "Java Communication Leadership",
    "Data Analysis Project Management"
]

education = [
    "B.E Computer Engineering",
    "B.Tech Information Technology",
    "B.Sc Computer Science",
    "MBA Finance"
]

experiences = [
    "2 years software development",
    "1 year data analysis",
    "3 years project management",
    "6 months internship"
]

topics = [
    "Project planning",
    "Product development",
    "Marketing strategy",
    "System architecture"
]

actions = [
    "Prepare project report",
    "Review requirements",
    "Contact vendor",
    "Update documentation"
]

features = [
    "Wireless connectivity and rechargeable battery",
    "High performance processor and large storage",
    "Cloud synchronization and security"
]

requirements = [
    "Secure authentication and reporting",
    "Automated workflow and user management",
    "Scalable architecture and monitoring"
]

projects = [
    "Customer Portal", "Inventory System",
    "Payment Platform", "Analytics Dashboard"
]


def random_number():
    return random.randint(1000, 9999)


def random_date():
    year = random.choice([2024, 2025, 2026])
    month = random.randint(1, 12)
    day = random.randint(1, 28)
    return f"{day:02d}-{month:02d}-{year}"


def generate_values():
    subtotal = random.randint(500, 50000)
    tax = int(subtotal * random.choice([0.05, 0.12, 0.18]))
    total = subtotal + tax

    return {
        "name": random.choice(names),
        "seller": random.choice(companies),
        "buyer": random.choice(companies),
        "store": random.choice(stores),
        "product": random.choice(products),
        "service": random.choice(services),
        "department": random.choice(departments),
        "course": random.choice(courses),
        "skills": random.choice(skills),
        "education": random.choice(education),
        "experience": random.choice(experiences),
        "topic": random.choice(topics),
        "action": random.choice(actions),
        "features": random.choice(features),
        "requirements": random.choice(requirements),
        "project": random.choice(projects),
        "objective": random.choice(requirements),
        "milestone": random.choice([
            "Planning and Development",
            "Testing and Deployment",
            "Design and Implementation"
        ]),
        "room": random.choice(["101", "204", "305", "412"]),
        "grade": random.choice(["A", "B+", "A+", "B"]),
        "attendance": random.choice(["88%", "92%", "95%", "81%"]),
        "account": str(random.randint(1000000000, 9999999999)),
        "account4": str(random.randint(1000, 9999)),
        "semester": random.randint(1, 8),
        "rating": random.choice(["3/5", "4/5", "5/5"]),
        "comment": random.choice([
            "Good experience",
            "Product quality was satisfactory",
            "Needs improvement",
            "Excellent service"
        ]),
        "status": random.choice([
            "Approved",
            "Pending",
            "Completed",
            "Active"
        ]),
        "dimensions": random.choice([
            "20 x 10 x 5 cm",
            "30 x 20 x 8 cm",
            "15 x 15 x 4 cm"
        ]),
        "number": random_number(),
        "number2": random_number(),
        "date": random_date(),
        "date2": random_date(),
        "qty": random.randint(1, 10),
        "price": random.randint(100, 5000),
        "subtotal": subtotal,
        "tax": tax,
        "total": total,
        "discount": random.randint(0, 1000),
        "change": random.randint(0, 500),
        "gstin": f"27ABCDE{random.randint(1000,9999)}F1Z5"
    }


def generate_class(template_list, label, count):
    rows = []

    for _ in range(count):
        template = random.choice(template_list)
        values = generate_values()

        text = template.format(**values)

        rows.append({
            "text": text,
            "label": label
        })

    return rows


# ============================================================
# GENERATE DATASET
# ============================================================

data = []

data.extend(generate_class(invoice_templates, "invoice", 100))
data.extend(generate_class(receipt_templates, "receipt", 100))
data.extend(generate_class(unknown_templates, "unknown", 100))

random.shuffle(data)

df = pd.DataFrame(data)

df.to_csv(OUTPUT_PATH, index=False)

print("V2 dataset generated successfully!")
print(f"Saved to: {OUTPUT_PATH}")
print(f"Total samples: {len(df)}")
print("\nClass distribution:")
print(df["label"].value_counts())