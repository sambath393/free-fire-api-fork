const puppeteer = require('puppeteer-extra');
const StealthPlugin = require('puppeteer-extra-plugin-stealth');
const { generateHOTP } = require('./garena');
const { garenaAcc } = require('../utilities/dev');

// Use the stealth plugin
puppeteer.use(StealthPlugin());

async function clearSpecificCookie(page, cookieName) {
  const cookies = await page.cookies();
  const cookieToDelete = cookies.find((cookie) => cookie.name === cookieName);

  if (cookieToDelete) {
    await page.deleteCookie(cookieToDelete);
    page.re;
    console.log(`Cookie "${cookieName}" cleared.`);
  } else {
    console.log(`Cookie "${cookieName}" not found.`);
  }
}

async function freeFireApi(app = '100067', item = '44111', userId = '9736578480') {
  const browserURL = 'http://127.0.0.1:9222'; // Remote debugging URL
  let browser;
  let page;

  try {
    // Connect Puppeteer to the existing Chrome instance
    browser = await puppeteer.connect({ browserURL });

    // Open a new tab
    page = await browser.newPage();

    // Navigate to the target URL
    const url = `https://shop.garena.my/?app=${app}&item=${item}&channel=202070`;
    await page.goto(url, { waitUntil: 'domcontentloaded' });

    // Clear the specific cookie by name
    await clearSpecificCookie(page, 'session_key');

    // Wait for the button using its class (CSS selector)
    await page.waitForSelector('button'); // Ensure buttons are loaded

    // Use evaluate to click the button and set userId
    await page.evaluate(async (userId) => {
      // Click the button with text "OK"
      const button = Array.from(document.querySelectorAll('button')).find(
        (el) => el.textContent.trim() === 'OK'
      );
      if (button) {
        button.click();
      } else {
        console.log('OK button not found');
      }

      await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 2 seconds

      // Set the userId in the input field
      const element = await document.querySelector(
        'input[placeholder="Please enter player ID here"]'
      );
      if (element) {
        // element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        // await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait for 2 seconds
        element.value = userId; // Assign userId
      }
    }, userId); // Pass userId as the second argument to evaluate

    await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 1 second

    // Use evaluate to click the "Login" button
    await page.evaluate(() => {
      const button = Array.from(document.querySelectorAll('button')).find(
        (el) => el.textContent.trim() === 'Login'
      );
      if (button) {
        button.click();
      } else {
        console.log('Login button not found');
      }
    });

    await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 1 second

    // Use evaluate to click the "Buy Now" button
    await page.evaluate(() => {
      const button = Array.from(document.querySelectorAll('button')).find(
        (el) => el.textContent.trim() === 'Buy Now'
      );
      if (button) {
        button.click();
      } else {
        console.log('Buy Now button not found');
      }
    });

    await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 4 seconds

    // Use evaluate to click the "Login" button again
    await page.evaluate(() => {
      const button = Array.from(document.querySelectorAll('button')).find(
        (el) => el.textContent.trim() === 'Login'
      );
      if (button) {
        button.click();
      } else {
        console.log('Login button not found');
      }
    });

    await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait for 4 seconds

    // Fill in the login form using page.evaluate
    await page.evaluate(async (garenaAcc) => {
      // Find the username field and set its value
      const usernameField = await document.querySelector(
        'input[placeholder="Garena Username, Email or Phone"]'
      );
      if (usernameField) {
        usernameField.value = garenaAcc.username; // Replace with your username
      }

      // Find the password field and set its value
      const passwordField = await document.querySelector('input[placeholder="Password"]');
      if (passwordField) {
        passwordField.value = garenaAcc.password; // Replace with your password
      }

      await new Promise((resolve) => setTimeout(resolve, 1000)); // Waits for 5 seconds

      // Find and click the "Login Now" button
      const loginButton = await document.querySelector('button.primary[type="submit"]');
      if (loginButton) {
        loginButton.click();
      }
    }, garenaAcc);

    await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait for 4 seconds

    // Handle OTP input if available
    const otpInputSelector = '[name="ssoOtpCode"]';
    const otpInputExists = await page.$(otpInputSelector);

    if (otpInputExists) {
      // Generate the OTP in Node.js
      const otpCode = generateHOTP();

      // Focus on the OTP input field
      await page.focus(otpInputSelector);

      // Simulate typing the OTP into the field
      await page.type(otpInputSelector, otpCode);
      console.log('OTP typed successfully.');
    } else {
      console.log('OTP input field not found.');
    }

    await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait for 4 seconds

    // Use evaluate to click the "Login" button again
    await page.evaluate(() => {
      const button = Array.from(document.querySelectorAll('button')).find(
        (el) => el.textContent.trim() === 'Confirm'
      );
      if (button) {
        button.click();
      } else {
        console.log('Login button not found');
      }
    });

    await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait for 4 seconds

    // Use page.evaluate to extract the Transaction ID
    const transactionId = await page.evaluate(() => {
      // Escape the special characters in the class name
      const transactionElement = document.querySelector('.text-sm\\/\\[22px\\]'); // Corrected selector
      if (transactionElement) {
        const text = transactionElement.textContent; // Get the text content
        return text.split('ID')[1];
      }
      return null;
    });

    return transactionId;
  } catch (error) {
    console.error('Error:', error.message);
    if (error.message.includes('Failed to open a new tab')) {
      console.log('Make sure Chrome is running with the --remote-debugging-port flag.');
    }
  } finally {
    if (page) {
      await page.close();
    }

    if (browser) {
      await browser.disconnect(); // Detach Puppeteer from the browser
    }
  }
}

module.exports = {
  freeFireApi,
};
