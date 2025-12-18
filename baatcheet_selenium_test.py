from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.keys import Keys
import time

# ---------------- Setup ChromeDriver ----------------
service = Service(r"D:\softwares\chromedriver\chromedriver.exe")  # Adjust path
options = Options()
options.add_argument("--disable-infobars")
options.add_argument("--disable-notifications")
options.add_argument("--start-maximized")
options.add_experimental_option("excludeSwitches", ["enable-automation", "enable-logging"])
options.add_experimental_option('prefs', {
    "credentials_enable_service": False,
    "profile.password_manager_enabled": False
})

driver = webdriver.Chrome(service=service, options=options)

# ---------------- Open App ----------------
driver.get("http://localhost:5173/")  # Replace with frontend external IP if deployed

wait = WebDriverWait(driver, 10)  # 10 second wait for elements

# ---------------- Test Case 1: Login ----------------
email_input = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "input[type='email']")))
email_input.send_keys("salaar@gmail.com")

password_input = driver.find_element(By.CSS_SELECTOR, "input[type='password']")
password_input.send_keys("123456")

login_button = driver.find_element(By.CSS_SELECTOR, "button.auth-btn")
login_button.click()

# Wait until dashboard/contact list loads
wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "div.cursor-pointer")))
print("✅ Login successful")

# Screenshot after login
driver.save_screenshot("step1_login.png")

# ---------------- Test Case 2: Select Contact ----------------
first_contact = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, "div.cursor-pointer")))
first_contact.click()
print("✅ Contact selected")

# Screenshot after selecting contact
driver.save_screenshot("step2_contact_selected.png")

# ---------------- Test Case 3: Send Message ----------------
# Wait for the message input to be present and interactable
message_input = wait.until(EC.presence_of_element_located((By.CSS_SELECTOR, "input[type='text'][placeholder='Type your message...']")))

# Clear any existing text
message_input.clear()

# Type the message
message_input.send_keys("Hello from Selenium!")

# Give a small delay to ensure the text is registered
time.sleep(0.5)

# Find and click the send button (the one with SendIcon)
send_button = wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, "button[type='submit'].bg-gradient-to-r")))
send_button.click()

print("✅ Message sent successfully")

# Wait a moment to see the message appear
time.sleep(1)

# Screenshot after sending message
driver.save_screenshot("step3_message_sent.png")

# ---------------- Test Case 4: Send Multiple Messages (Optional) ----------------
# You can send multiple messages in a loop
messages = ["Second message", "Third message", "Testing automation!"]
for msg in messages:
    message_input = driver.find_element(By.CSS_SELECTOR, "input[type='text'][placeholder='Type your message...']")
    message_input.clear()
    message_input.send_keys(msg)
    
    send_button = driver.find_element(By.CSS_SELECTOR, "button[type='submit'].bg-gradient-to-r")
    send_button.click()
    
    time.sleep(0.5)  # Small delay between messages
    print(f"✅ Sent: {msg}")

driver.save_screenshot("step3b_multiple_messages.png")

# ---------------- Test Case 5: Logout ----------------
logout_button = wait.until(EC.element_to_be_clickable((By.XPATH, "//button[.//svg[contains(@class,'LogOutIcon')]]")))
logout_button.click()
print("✅ Logout successful")

# Screenshot after logout
driver.save_screenshot("step4_logout.png")

# ---------------- Close Browser ----------------
driver.quit()