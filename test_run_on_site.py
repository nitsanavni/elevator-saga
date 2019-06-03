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


@pytest.fixture
def driver():
    driver = webdriver.Chrome(ChromeDriverManager().install())
    yield driver
    time.sleep(15)
    driver.close()


@pytest.fixture
def wait(driver):
    return WebDriverWait(driver, 10)


def test_example(driver, wait):
    driver.get('http://play.elevatorsaga.com/#challenge=8')
    codeAreaSelector = "body > div > div.code > div > div.CodeMirror-scroll > div.CodeMirror-sizer > div > div > div > div.CodeMirror-code > div:nth-child(1) > pre"
    wait.until(EC.element_to_be_clickable((By.CSS_SELECTOR, codeAreaSelector)))
    codeAreaElement = driver.find_element_by_css_selector(codeAreaSelector)
    code = open("packed.js", 'r').read()
    ActionChains(driver) \
        .click(codeAreaElement) \
        .key_down(Keys.COMMAND) \
        .send_keys("a") \
        .key_up(Keys.COMMAND) \
        .key_down(Keys.LEFT_SHIFT) \
        .key_down(Keys.INSERT) \
        .perform()
    elem = driver.switch_to.active_element
    # elem.send_keys("llo" + str(elem.get_attribute("tagName")))
    # driver.execute_script("document.getElementById('idName').setAttribute('value', 'text_to_put');
    driver.save_screenshot("screenshot.png")
