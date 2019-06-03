import pytest
import time
import os
from selenium import webdriver
from webdriver_manager.chrome import ChromeDriverManager
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.action_chains import ActionChains
from io import BytesIO


def current_time(): return int(round(time.time() * 1000))


@pytest.fixture
def driver():
    driver = webdriver.Chrome(ChromeDriverManager().install())
    yield driver
    driver.save_screenshot("screenshot_" + str(current_time()) + ".png")
    time.sleep(5)
    driver.close()


@pytest.fixture
def wait(driver):
    return WebDriverWait(driver, 120)


def apply(driver, wait):
    save_id = "button_save"
    wait.until(EC.element_to_be_clickable((By.ID, save_id)))
    # driver.find_element_by_id(save_id).click()
    driver.find_element_by_id("button_apply").click()


def clickStart(driver):
    driver.find_element_by_class_name("startstop").click()


def test_challenge_8(driver, wait):
    getChallenge8(driver)
    pasteCodeIntoEditor(wait, driver)
    clickStart(driver)
    waitForChallengeToEnd(wait)
    assertChallengeSucceeded(driver)


def assertChallengeSucceeded(driver):
    success_selector = "body > div > div.world > div.feedbackcontainer > div > a"
    try:
        nextChallengeElement = driver.find_element_by_css_selector(
            success_selector)
    except:
        pytest.fail("challenge #8 failed")


def waitForChallengeToEnd(wait):
    feedback_selector = "body > div > div.world > div.feedbackcontainer > div > p"
    wait.until(EC.visibility_of_element_located(
        (By.CSS_SELECTOR, feedback_selector)))


def pasteCodeIntoEditor(wait, driver):
    codeAreaSelector = "body > div > div.code > div > div.CodeMirror-scroll > div.CodeMirror-sizer > div > div > div > div.CodeMirror-code > div:nth-child(1) > pre"
    wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, codeAreaSelector)))
    codeAreaElement = driver.find_element_by_css_selector(codeAreaSelector)
    ActionChains(driver) \
        .click(codeAreaElement) \
        .key_down(Keys.COMMAND) \
        .send_keys("a") \
        .key_up(Keys.COMMAND) \
        .key_down(Keys.LEFT_SHIFT) \
        .key_down(Keys.INSERT) \
        .perform()


def getChallenge8(driver):
    driver.get('http://play.elevatorsaga.com/#challenge=8')
