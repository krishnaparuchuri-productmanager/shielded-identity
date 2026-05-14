"""
FraudShield Identity - Fixed Screenshot Capture (Pass 2)
Captures missing flows: Aadhaar input, result with signals, FAB
"""
import os
import time
from playwright.sync_api import sync_playwright

BASE_URL = "http://localhost:5174"
SCREENSHOTS_DIR = os.path.join(os.path.dirname(__file__), "screenshots")
os.makedirs(SCREENSHOTS_DIR, exist_ok=True)

EMAIL = "kiran.patel@fraudshield.in"
PASSWORD = "demo1234"


def ss(page, name, description=""):
    path = os.path.join(SCREENSHOTS_DIR, name)
    page.screenshot(path=path, full_page=False)
    print(f"  SAVED {name}  {description}")
    return path


def login(page):
    page.goto(f"{BASE_URL}/login", wait_until="networkidle")
    page.wait_for_timeout(500)
    page.fill("input[type='email']", EMAIL)
    page.fill("input[type='password']", PASSWORD)
    page.click("button[type='submit']")
    page.wait_for_url("**/dashboard", timeout=8000)
    page.wait_for_timeout(800)


def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        ctx = browser.new_context(
            viewport={"width": 390, "height": 844},
            device_scale_factor=2,
        )
        page = ctx.new_page()

        # Login first
        login(page)

        # ── Scan page with Aadhaar input filled ──────────────────────────
        print("\n[A] Scan Page - Aadhaar Input")
        page.goto(f"{BASE_URL}/scan", wait_until="networkidle")
        page.wait_for_timeout(800)

        # Use the id="aadhaar-input"
        aadhaar_field = page.locator("#aadhaar-input")
        aadhaar_field.wait_for(timeout=5000)
        aadhaar_field.click()
        # Type digits - component formats as XXXX-XXXX-XXXX
        aadhaar_field.type("234567891234", delay=30)
        page.wait_for_timeout(500)
        ss(page, "06b-scan-filled.png", "Scan page - Aadhaar 12-digit entered")

        # ── Scan → Result via HIGH RISK chip ─────────────────────────────
        print("[B] Result Page via HIGH RISK chip")
        page.goto(f"{BASE_URL}/scan", wait_until="networkidle")
        page.wait_for_timeout(600)

        # Find chip by text content
        chip = page.get_by_text("HIGH RISK")
        if chip.count() == 0:
            chip = page.get_by_text("High Risk")
        chip.first.click()

        # Wait for navigation to result
        try:
            page.wait_for_url("**/result**", timeout=6000)
            page.wait_for_timeout(800)
            ss(page, "07-result-high.png", "Result - HIGH RISK (score 72)")
            page.mouse.wheel(0, 250)
            page.wait_for_timeout(400)
            ss(page, "07b-result-signals.png", "Result - fraud signals detected")
            page.mouse.wheel(0, 250)
            page.wait_for_timeout(400)
            ss(page, "07c-result-details.png", "Result - identity details")
        except Exception as e:
            print(f"    Result nav error: {e}")

        # ── Scan → Result via CRITICAL chip ──────────────────────────────
        print("[C] Result Page via CRITICAL chip")
        page.goto(f"{BASE_URL}/scan", wait_until="networkidle")
        page.wait_for_timeout(600)

        chip_crit = page.get_by_text("CRITICAL RISK")
        if chip_crit.count() == 0:
            chip_crit = page.get_by_text("Critical Risk")
        chip_crit.first.click()

        try:
            page.wait_for_url("**/result**", timeout=6000)
            page.wait_for_timeout(800)
            ss(page, "07d-result-critical.png", "Result - CRITICAL RISK (score 91)")
        except Exception as e:
            print(f"    Critical result: {e}")

        # ── Dashboard FAB ─────────────────────────────────────────────────
        print("[D] Dashboard - FAB quick actions")
        page.goto(f"{BASE_URL}/dashboard", wait_until="networkidle")
        page.wait_for_timeout(800)

        # Take a clean dashboard screenshot at mobile width
        ss(page, "04-dashboard-clean.png", "Dashboard overview")

        # Try to find FAB - it's a circle button with a + icon at bottom right
        try:
            # Find all buttons and look for the one with Plus icon or "+" aria
            all_buttons = page.locator("button").all()
            print(f"    Total buttons: {len(all_buttons)}")
            for btn in all_buttons:
                txt = btn.inner_text().strip()
                aria = btn.get_attribute("aria-label") or ""
                print(f"      btn text='{txt}' aria='{aria}'")
                if "new scan" in txt.lower() or "new scan" in aria.lower():
                    btn.click()
                    break
            else:
                # Try clicking at the bottom-right area of the screen where FAB typically is
                page.mouse.click(355, 750)
            page.wait_for_timeout(600)
            ss(page, "05-dashboard-fab.png", "Quick actions bottom sheet")
        except Exception as e:
            print(f"    FAB error: {e}")

        # ── KYC step navigation ───────────────────────────────────────────
        print("[E] KYC Page - step interactions")
        page.goto(f"{BASE_URL}/kyc", wait_until="networkidle")
        page.wait_for_timeout(800)
        ss(page, "08-kyc-step1.png", "KYC - Step 1 Aadhaar verification")

        # Try clicking next step
        try:
            next_btn = page.get_by_role("button", name="Next")
            if next_btn.count() == 0:
                next_btn = page.locator("button").filter(has_text="Continue")
            if next_btn.count() == 0:
                next_btn = page.locator("button").filter(has_text="Proceed")
            next_btn.first.click()
            page.wait_for_timeout(600)
            ss(page, "08c-kyc-step2.png", "KYC - Step 2 Document upload")
        except Exception as e:
            print(f"    KYC next: {e}")

        browser.close()
        print(f"\nDONE All screenshots in: {SCREENSHOTS_DIR}")
        all_files = sorted(f for f in os.listdir(SCREENSHOTS_DIR) if f.endswith('.png'))
        for f in all_files:
            size = os.path.getsize(os.path.join(SCREENSHOTS_DIR, f)) // 1024
            print(f"   {f}  ({size} KB)")


if __name__ == "__main__":
    run()
