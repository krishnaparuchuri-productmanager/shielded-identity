"""
FraudShield Identity - Annotated Demo Video Generator
Produces: app-demo-annotated.mp4 (60s, 30fps, 1080x1920, H.264)
Structure:
  0-5s   Splash/Home
  5-10s  Login
  10-15s Dashboard (5s pause)
  15-25s Features navigation
  25-30s Scan flow
  30-35s Result / risk score (5s pause)
  35-45s KYC workflow
  45-55s Profile + logout
  55-60s End title card
"""

import os
import sys
import time
import math
import textwrap
from io import BytesIO
from PIL import Image, ImageDraw, ImageFont
import imageio
from playwright.sync_api import sync_playwright

BASE_URL = "http://localhost:5174"
SCREENSHOTS_DIR = os.path.join(os.path.dirname(__file__), "screenshots")
OUTPUT_VIDEO = os.path.join(SCREENSHOTS_DIR, "app-demo-annotated.mp4")

EMAIL = "kiran.patel@fraudshield.in"
PASSWORD = "demo1234"

FPS = 30
CANVAS_W = 1080
CANVAS_H = 1920
PHONE_W = 780      # display width of phone inside canvas
PHONE_H = 1688     # display height of phone (maintains 390:844 ratio * 2)
PHONE_X = (CANVAS_W - PHONE_W) // 2   # center horizontally
PHONE_Y = 60

# Colors
BG_COLOR = (15, 15, 20)           # very dark navy
OVERLAY_BG = (0, 0, 0, 180)       # semi-transparent black
TEXT_COLOR = (255, 255, 255)       # white
ACCENT_COLOR = (0, 210, 180)       # teal (matching app theme)
STEP_BG = (0, 180, 160, 220)      # teal overlay
PROGRESS_BG = (40, 40, 50)
PROGRESS_FG = (0, 210, 180)

# Try to get a font
def get_font(size):
    candidates = [
        "C:/Windows/Fonts/arialbd.ttf",
        "C:/Windows/Fonts/arial.ttf",
        "C:/Windows/Fonts/segoeui.ttf",
        "C:/Windows/Fonts/calibrib.ttf",
    ]
    for path in candidates:
        if os.path.exists(path):
            try:
                return ImageFont.truetype(path, size)
            except Exception:
                pass
    return ImageFont.load_default()

FONT_TITLE = get_font(48)
FONT_STEP = get_font(38)
FONT_BODY = get_font(28)
FONT_SMALL = get_font(22)
FONT_PROGRESS = get_font(20)


def page_screenshot_to_pil(page):
    """Capture Playwright screenshot and return as PIL Image."""
    buf = page.screenshot()
    img = Image.open(BytesIO(buf)).convert("RGBA")
    return img


def compose_frame(phone_img, step_text, sub_text, elapsed_sec, total_sec=60,
                  alpha_in=1.0, show_logo=True, end_card=False):
    """
    Compose a full 1080x1920 frame:
      - Dark background
      - Phone screenshot centered
      - Bottom annotation bar
      - Top progress bar
      - Step label
    """
    frame = Image.new("RGBA", (CANVAS_W, CANVAS_H), BG_COLOR + (255,))
    draw = ImageDraw.Draw(frame)

    # ── subtle grid pattern background ──
    for gx in range(0, CANVAS_W, 60):
        draw.line([(gx, 0), (gx, CANVAS_H)], fill=(30, 35, 45, 255), width=1)
    for gy in range(0, CANVAS_H, 60):
        draw.line([(0, gy), (CANVAS_W, gy)], fill=(30, 35, 45, 255), width=1)

    if end_card:
        # Full-screen end card
        # Logo shield
        cx, cy = CANVAS_W // 2, CANVAS_H // 2 - 180
        r = 120
        draw.ellipse([(cx-r, cy-r), (cx+r, cy+r)], fill=(0, 210, 180, 255))
        # Text
        title = "FraudShield Identity"
        bbox = draw.textbbox((0,0), title, font=FONT_TITLE)
        tw = bbox[2] - bbox[0]
        draw.text(((CANVAS_W - tw) // 2, cy + r + 40), title,
                  fill=TEXT_COLOR, font=FONT_TITLE)
        sub = "App Demo Complete"
        bbox2 = draw.textbbox((0,0), sub, font=FONT_STEP)
        sw = bbox2[2] - bbox2[0]
        draw.text(((CANVAS_W - sw) // 2, cy + r + 110), sub,
                  fill=ACCENT_COLOR, font=FONT_STEP)
        return frame.convert("RGB")

    # ── phone frame (rounded rect shadow) ──
    shadow_offset = 8
    for i in range(6, 0, -1):
        alpha = int(80 * i / 6)
        shadow_color = (0, 0, 0, alpha)
        sx = PHONE_X - i + shadow_offset
        sy = PHONE_Y - i + shadow_offset
        draw.rounded_rectangle(
            [(sx, sy), (sx + PHONE_W + i*2, sy + PHONE_H + i*2)],
            radius=36, fill=shadow_color
        )

    # ── phone screenshot ──
    if phone_img is not None:
        # Scale phone image to fill phone frame
        scaled = phone_img.resize((PHONE_W, PHONE_H), Image.LANCZOS)
        # Paste with rounded mask
        mask = Image.new("L", (PHONE_W, PHONE_H), 0)
        mask_draw = ImageDraw.Draw(mask)
        mask_draw.rounded_rectangle([(0, 0), (PHONE_W-1, PHONE_H-1)], radius=32, fill=255)
        frame.paste(scaled, (PHONE_X, PHONE_Y), mask)
    else:
        # Placeholder dark phone
        draw.rounded_rectangle(
            [(PHONE_X, PHONE_Y), (PHONE_X + PHONE_W, PHONE_Y + PHONE_H)],
            radius=32, fill=(30, 35, 45, 255)
        )

    # ── top progress bar ──
    pb_h = 6
    pb_y = 20
    pb_margin = 40
    pb_w = CANVAS_W - pb_margin * 2
    draw.rounded_rectangle(
        [(pb_margin, pb_y), (pb_margin + pb_w, pb_y + pb_h)],
        radius=3, fill=PROGRESS_BG
    )
    progress = min(elapsed_sec / total_sec, 1.0)
    filled_w = int(pb_w * progress)
    if filled_w > 0:
        draw.rounded_rectangle(
            [(pb_margin, pb_y), (pb_margin + filled_w, pb_y + pb_h)],
            radius=3, fill=PROGRESS_FG
        )

    # Timer
    timer_text = f"{int(elapsed_sec):02d}s / {int(total_sec):02d}s"
    draw.text((CANVAS_W - pb_margin - 80, pb_y - 4), timer_text,
              fill=(150, 150, 150), font=FONT_PROGRESS)

    # ── bottom annotation bar ──
    bar_h = 160
    bar_y = CANVAS_H - bar_h
    # Semi-transparent overlay
    overlay = Image.new("RGBA", (CANVAS_W, bar_h), (5, 10, 20, 210))
    frame.paste(overlay, (0, bar_y), overlay)
    draw = ImageDraw.Draw(frame)

    # Step text with teal accent
    if step_text:
        # Fade alpha
        text_alpha = int(255 * min(alpha_in, 1.0))
        # Teal pill for step label
        bbox_s = draw.textbbox((0,0), step_text, font=FONT_STEP)
        sw = bbox_s[2] - bbox_s[0]
        pill_x = (CANVAS_W - sw - 40) // 2
        pill_y = bar_y + 20
        draw.rounded_rectangle(
            [(pill_x, pill_y), (pill_x + sw + 40, pill_y + 52)],
            radius=26, fill=(0, 180, 155, text_alpha)
        )
        draw.text((pill_x + 20, pill_y + 8), step_text,
                  fill=TEXT_COLOR, font=FONT_STEP)

    # Sub text
    if sub_text:
        bbox_b = draw.textbbox((0,0), sub_text, font=FONT_BODY)
        bw = bbox_b[2] - bbox_b[0]
        draw.text(((CANVAS_W - bw) // 2, bar_y + 90), sub_text,
                  fill=(200, 200, 200), font=FONT_BODY)

    # ── branding watermark ──
    brand = "FraudShield Identity  |  AI-Powered Fraud Detection"
    bbox_br = draw.textbbox((0,0), brand, font=FONT_SMALL)
    bw = bbox_br[2] - bbox_br[0]
    draw.text(((CANVAS_W - bw) // 2, pb_y + pb_h + 8), brand,
              fill=(80, 80, 90), font=FONT_SMALL)

    return frame.convert("RGB")


def secs_to_frames(s):
    return int(s * FPS)


def eased_alpha(frame_idx, total_frames, ease_in=True, ease_out=True):
    """Return 0..1 alpha with optional ease in/out."""
    t = frame_idx / max(total_frames - 1, 1)
    if ease_in and ease_out:
        return t * t * (3 - 2 * t)  # smoothstep
    elif ease_in:
        return t * t
    elif ease_out:
        return 1 - (1-t) * (1-t)
    return t


def capture_page(page, url=None, wait_ms=800):
    if url:
        page.goto(url, wait_until="networkidle")
    page.wait_for_timeout(wait_ms)
    return page_screenshot_to_pil(page)


class VideoWriter:
    def __init__(self, path):
        self.writer = imageio.get_writer(
            path, fps=FPS, codec='libx264',
            quality=8, pixelformat='yuv420p',
            macro_block_size=None
        )
        self.frame_count = 0

    def add_frames(self, frame_pil, count):
        arr = __import__('numpy').array(frame_pil)
        for _ in range(count):
            self.writer.append_data(arr)
            self.frame_count += 1

    def close(self):
        self.writer.close()
        print(f"  Video written: {self.frame_count} frames ({self.frame_count/FPS:.1f}s)")


def run():
    import numpy as np

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        ctx = browser.new_context(
            viewport={"width": 390, "height": 844},
            device_scale_factor=2,
        )
        page = ctx.new_page()

        writer = VideoWriter(OUTPUT_VIDEO)
        elapsed = 0.0

        def add_segment(img, step_label, sub_label, duration_s, transition_s=0.3):
            nonlocal elapsed
            total_frames = secs_to_frames(duration_s)
            trans_frames = secs_to_frames(transition_s)
            for i in range(total_frames):
                alpha = 1.0
                if i < trans_frames:  # fade in
                    alpha = eased_alpha(i, trans_frames, ease_in=True, ease_out=False)
                elif i > total_frames - trans_frames:  # fade out
                    alpha = eased_alpha(total_frames - i, trans_frames, ease_in=False, ease_out=True)
                f = compose_frame(img, step_label, sub_label, elapsed, alpha_in=alpha)
                writer.add_frames(f, 1)
                elapsed += 1/FPS

        # ────────────────────────────────────────────────────────────────
        # 0–5s  Splash Screen
        # ────────────────────────────────────────────────────────────────
        print("[0-5s] Splash screen")
        img = capture_page(page, BASE_URL, 800)
        add_segment(img, "Step 1: App Landing Page",
                    "FraudShield - AI-Powered Fraud Protection", 5.0)

        # ────────────────────────────────────────────────────────────────
        # 5–10s  Login
        # ────────────────────────────────────────────────────────────────
        print("[5-10s] Login page")
        page.click("text=Sign in")
        page.wait_for_url("**/login", timeout=5000)
        page.wait_for_timeout(400)
        img = page_screenshot_to_pil(page)
        add_segment(img, "Step 2: User Login",
                    "Demo: kiran.patel@fraudshield.in / demo1234", 3.0)

        # Fill form while capturing
        page.fill("input[type='email']", EMAIL)
        page.fill("input[type='password']", PASSWORD)
        page.wait_for_timeout(300)
        img = page_screenshot_to_pil(page)
        add_segment(img, "Step 2: User Login",
                    "Credentials entered - authenticating...", 2.0)

        # Submit
        page.click("button[type='submit']")
        page.wait_for_url("**/dashboard", timeout=8000)
        page.wait_for_timeout(600)

        # ────────────────────────────────────────────────────────────────
        # 10–15s  Dashboard (5s pause)
        # ────────────────────────────────────────────────────────────────
        print("[10-15s] Dashboard 5s pause")
        img = page_screenshot_to_pil(page)
        add_segment(img, "Step 3: Main Dashboard",
                    "KPI overview: 142 cases today, real-time risk monitoring", 5.0)

        # ────────────────────────────────────────────────────────────────
        # 15–25s  Key Features Navigation
        # ────────────────────────────────────────────────────────────────
        print("[15-20s] Dashboard scroll / case list")
        page.mouse.wheel(0, 280)
        page.wait_for_timeout(400)
        img = page_screenshot_to_pil(page)
        add_segment(img, "Step 4: Key Features Demo",
                    "Live fraud case queue: P1 Critical to P3 Low priority", 3.0)

        # Filter P1 Critical
        try:
            page.locator("button").filter(has_text="P1 Critical").first.click()
            page.wait_for_timeout(500)
        except Exception:
            pass
        img = page_screenshot_to_pil(page)
        add_segment(img, "Step 4: Key Features Demo",
                    "Filter by P1 Critical - Identity Theft & Synthetic Fraud", 3.0)

        # Reset filter, scroll back
        try:
            page.locator("button").filter(has_text="All").first.click()
        except Exception:
            pass
        page.mouse.wheel(0, -280)
        page.wait_for_timeout(300)

        # Show FAB
        try:
            page.locator("button[aria-label='New action']").click()
            page.wait_for_timeout(500)
            img = page_screenshot_to_pil(page)
            add_segment(img, "Step 4: Key Features Demo",
                        "Quick Actions: New Scan / Manual Case Entry / Bulk Upload", 2.0)
            page.keyboard.press("Escape")
            page.wait_for_timeout(300)
        except Exception:
            pass

        # ────────────────────────────────────────────────────────────────
        # 25–30s  Scan Flow / CRUD
        # ────────────────────────────────────────────────────────────────
        print("[25-30s] Scan flow")
        img = capture_page(page, f"{BASE_URL}/scan", 600)
        add_segment(img, "Step 5: Identity Scan Flow",
                    "Enter 12-digit Aadhaar for real-time risk scoring", 2.0)

        # Type in Aadhaar
        aadhaar_field = page.locator("#aadhaar-input")
        aadhaar_field.wait_for(timeout=5000)
        aadhaar_field.click()
        aadhaar_field.type("234567891234", delay=40)
        page.wait_for_timeout(400)
        img = page_screenshot_to_pil(page)
        add_segment(img, "Step 5: Identity Scan Flow",
                    "Aadhaar validated - AI scoring in progress...", 3.0)

        # ────────────────────────────────────────────────────────────────
        # 30–35s  Result / Analytics (5s pause)
        # ────────────────────────────────────────────────────────────────
        print("[30-35s] Result page HIGH RISK - 5s pause")
        page.goto(f"{BASE_URL}/scan", wait_until="networkidle")
        page.wait_for_timeout(400)
        chip = page.get_by_text("HIGH RISK")
        if chip.count() == 0:
            chip = page.get_by_text("High Risk")
        chip.first.click()
        page.wait_for_url("**/result**", timeout=8000)
        page.wait_for_timeout(700)
        img = page_screenshot_to_pil(page)
        add_segment(img, "Step 6: Analytics / Risk Report",
                    "HIGH RISK score 72 - 3 fraud signals detected", 5.0)

        # Scroll to signals
        page.mouse.wheel(0, 250)
        page.wait_for_timeout(400)
        img = page_screenshot_to_pil(page)
        add_segment(img, "Step 6: Analytics / Risk Report",
                    "Fraud signals: SIM Swap, Address Mismatch, Multiple Loans", 3.0)

        # CRITICAL RISK result
        page.goto(f"{BASE_URL}/scan", wait_until="networkidle")
        page.wait_for_timeout(400)
        chip_crit = page.get_by_text("CRITICAL RISK")
        if chip_crit.count() == 0:
            chip_crit = page.get_by_text("Critical Risk")
        chip_crit.first.click()
        page.wait_for_url("**/result**", timeout=8000)
        page.wait_for_timeout(700)
        img = page_screenshot_to_pil(page)
        add_segment(img, "Step 6: Analytics / Risk Report",
                    "CRITICAL score 91 - Identity Theft flagged, escalate!", 2.0)

        # ────────────────────────────────────────────────────────────────
        # 35–45s  KYC Workflow
        # ────────────────────────────────────────────────────────────────
        print("[35-45s] KYC workflow")
        img = capture_page(page, f"{BASE_URL}/kyc", 600)
        add_segment(img, "Step 7: KYC Verification Workflow",
                    "4-step guided onboarding: Aadhaar → Docs → Liveness → Review", 4.0)

        page.mouse.wheel(0, 250)
        page.wait_for_timeout(400)
        img = page_screenshot_to_pil(page)
        add_segment(img, "Step 7: KYC Verification Workflow",
                    "Step-by-step compliance workflow for KYC teams", 3.0)
        page.mouse.wheel(0, -250)

        # Try to progress KYC
        try:
            # Look for "Start Verification" or similar button
            start_btn = page.locator("button").filter(has_text="Start").first
            start_btn.click()
            page.wait_for_timeout(600)
            img = page_screenshot_to_pil(page)
            add_segment(img, "Step 7: KYC Verification Workflow",
                        "Aadhaar verification initiated - UIDAI compliant", 3.0)
        except Exception:
            img = page_screenshot_to_pil(page)
            add_segment(img, "Step 7: KYC Verification Workflow",
                        "UIDAI compliant - Aadhaar-linked verification flow", 3.0)

        # ────────────────────────────────────────────────────────────────
        # 45–55s  Profile + Session
        # ────────────────────────────────────────────────────────────────
        print("[45-55s] Profile and logout")
        img = capture_page(page, f"{BASE_URL}/profile", 600)
        add_segment(img, "Step 8: Session Complete",
                    "User profile: Kiran Patel, Senior Fraud Analyst", 3.0)

        # Scroll profile
        page.mouse.wheel(0, 250)
        page.wait_for_timeout(400)
        img = page_screenshot_to_pil(page)
        add_segment(img, "Step 8: Session Complete",
                    "Role-based access • Audit trail • Notification settings", 3.0)
        page.mouse.wheel(0, -250)

        # Logout
        try:
            logout_btn = page.locator("button").filter(has_text="Sign Out").first
            if logout_btn.count() == 0:
                logout_btn = page.locator("button").filter(has_text="Log out").first
            logout_btn.click()
            page.wait_for_url("**/login**", timeout=5000)
            page.wait_for_timeout(400)
            img = page_screenshot_to_pil(page)
            add_segment(img, "Step 8: Session Complete",
                        "Secure session ended - audit trail recorded", 2.0)
        except Exception as e:
            img = page_screenshot_to_pil(page)
            add_segment(img, "Step 8: Session Complete",
                        "Session management with secure sign-out", 2.0)

        # Go back to splash
        img = capture_page(page, BASE_URL, 400)
        add_segment(img, "Step 8: Session Complete",
                    "Return to landing - ready for next analyst session", 2.0)

        # ────────────────────────────────────────────────────────────────
        # 55–60s  End Card
        # ────────────────────────────────────────────────────────────────
        print("[55-60s] End card")
        elapsed_before = elapsed
        total_end_frames = secs_to_frames(5.0)
        for i in range(total_end_frames):
            alpha = eased_alpha(i, min(30, total_end_frames), ease_in=True, ease_out=False)
            f = compose_frame(None, "", "", elapsed, alpha_in=alpha, end_card=True)
            writer.add_frames(f, 1)
            elapsed += 1/FPS

        # Pad to exactly 60s if needed
        target_frames = secs_to_frames(60.0)
        if writer.frame_count < target_frames:
            pad_count = target_frames - writer.frame_count
            f = compose_frame(None, "", "", 60.0, alpha_in=1.0, end_card=True)
            writer.add_frames(f, pad_count)

        writer.close()
        browser.close()

    size_mb = os.path.getsize(OUTPUT_VIDEO) / (1024 * 1024)
    print(f"\nDONE: {OUTPUT_VIDEO}")
    print(f"Size: {size_mb:.1f} MB")
    print(f"Duration: ~60s at {FPS}fps")


if __name__ == "__main__":
    run()
