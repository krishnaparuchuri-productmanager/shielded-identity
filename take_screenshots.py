"""
FraudShield Identity - Systematic Screenshot Capture
Captures all major flows: splash, login, dashboard, scan, result, KYC, profile
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
    print(f"  OK {name}  {description}")
    return path


def run():
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        ctx = browser.new_context(
            viewport={"width": 390, "height": 844},  # iPhone 14 Pro size
            device_scale_factor=2,
        )
        page = ctx.new_page()

        # ── 01 Splash / Home ──────────────────────────────────────────────
        print("\n[1/9] Splash Screen")
        page.goto(BASE_URL, wait_until="networkidle")
        page.wait_for_timeout(800)
        ss(page, "01-home-splash.png", "Splash screen / landing")

        # ── 02 Click Sign In → Login ─────────────────────────────────────
        print("[2/9] Login Page")
        page.click("text=Sign in")
        page.wait_for_url("**/login", timeout=5000)
        page.wait_for_timeout(600)
        ss(page, "02-login.png", "Login page with demo creds")

        # ── 03 Fill credentials & submit ────────────────────────────────
        print("[3/9] Login - Filling credentials")
        page.fill("input[type='email']", EMAIL)
        page.fill("input[type='password']", PASSWORD)
        page.wait_for_timeout(400)
        ss(page, "03-login-filled.png", "Login form filled")

        page.click("button[type='submit']")
        page.wait_for_url("**/dashboard", timeout=8000)
        page.wait_for_timeout(1000)

        # ── 04 Dashboard ─────────────────────────────────────────────────
        print("[4/9] Dashboard")
        ss(page, "04-dashboard.png", "Main analyst dashboard with KPIs")

        # Scroll to see case list
        page.mouse.wheel(0, 300)
        page.wait_for_timeout(500)
        ss(page, "04b-dashboard-cases.png", "Dashboard - fraud cases list")
        page.mouse.wheel(0, -300)

        # ── 05 Dashboard FAB / Quick Actions ─────────────────────────────
        print("[5/9] Dashboard - Quick Actions FAB")
        try:
            # Click the floating action button (+ button)
            fab = page.locator("button").filter(has_text="+").first
            fab.click()
            page.wait_for_timeout(600)
            ss(page, "05-dashboard-fab.png", "Quick action menu (New Scan, Manual Entry, Bulk Upload)")
            # Close with escape
            page.keyboard.press("Escape")
            page.wait_for_timeout(300)
        except Exception as e:
            print(f"    FAB not found: {e}")

        # ── 06 Scan Page ─────────────────────────────────────────────────
        print("[6/9] Scan Page")
        page.goto(f"{BASE_URL}/scan", wait_until="networkidle")
        page.wait_for_timeout(800)
        ss(page, "06-scan.png", "Identity scan page")

        # Type an Aadhaar number
        try:
            aadhaar_input = page.locator("input[maxlength='12'], input[placeholder*='Aadhaar'], input[placeholder*='12-digit']").first
            aadhaar_input.fill("234567890123")
            page.wait_for_timeout(400)
            ss(page, "06b-scan-filled.png", "Aadhaar input filled - scan ready")
        except Exception as e:
            print(f"    Aadhaar input: {e}")

        # ── 07 Scan Result - trigger via quick test chip ─────────────────
        print("[7/9] Result Page")
        # Click "Critical Risk" chip to auto-populate + scan
        try:
            page.goto(f"{BASE_URL}/scan", wait_until="networkidle")
            page.wait_for_timeout(600)
            # Look for quick-test chips
            chips = page.locator("button").all()
            for chip in chips:
                text = chip.inner_text().strip()
                if "High Risk" in text or "Critical" in text:
                    chip.click()
                    break
            page.wait_for_url("**/result", timeout=6000)
            page.wait_for_timeout(800)
            ss(page, "07-result.png", "Fraud detection result with risk score")
            page.mouse.wheel(0, 300)
            page.wait_for_timeout(400)
            ss(page, "07b-result-signals.png", "Result - fraud signals detail")
            page.mouse.wheel(0, -300)
        except Exception as e:
            print(f"    Result page: {e}")
            page.goto(f"{BASE_URL}/result", wait_until="networkidle")
            page.wait_for_timeout(800)
            ss(page, "07-result.png", "Result page")

        # ── 08 KYC Page ──────────────────────────────────────────────────
        print("[8/9] KYC Page")
        page.goto(f"{BASE_URL}/kyc", wait_until="networkidle")
        page.wait_for_timeout(800)
        ss(page, "08-kyc.png", "KYC verification workflow - step 1")
        page.mouse.wheel(0, 300)
        page.wait_for_timeout(400)
        ss(page, "08b-kyc-steps.png", "KYC workflow steps overview")
        page.mouse.wheel(0, -300)

        # ── 09 Profile Page ───────────────────────────────────────────────
        print("[9/9] Profile Page")
        page.goto(f"{BASE_URL}/profile", wait_until="networkidle")
        page.wait_for_timeout(800)
        ss(page, "09-profile.png", "User profile and settings")

        # ── Bottom Navigation ─────────────────────────────────────────────
        print("[+] Dashboard - filter interactions")
        page.goto(f"{BASE_URL}/dashboard", wait_until="networkidle")
        page.wait_for_timeout(600)
        # Click P1 Critical filter
        try:
            p1_btn = page.locator("button").filter(has_text="P1").first
            p1_btn.click()
            page.wait_for_timeout(500)
            ss(page, "10-dashboard-filter-p1.png", "Dashboard filtered by P1 Critical cases")
        except Exception as e:
            print(f"    P1 filter: {e}")

        browser.close()
        print(f"\nDONE All screenshots saved to: {SCREENSHOTS_DIR}")
        saved = sorted(os.listdir(SCREENSHOTS_DIR))
        for f in saved:
            path = os.path.join(SCREENSHOTS_DIR, f)
            size = os.path.getsize(path) // 1024
            print(f"   {f}  ({size} KB)")


if __name__ == "__main__":
    run()
