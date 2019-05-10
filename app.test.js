const {Builder, By} = require('selenium-webdriver')
const chrome = require('selenium-webdriver/chrome')

const rootUrl = 'http://localhost:8080'

const width = 640;
const height = 480;

let driver

beforeAll(() => {
  driver = new Builder()
    .forBrowser('chrome')
    .setChromeOptions(new chrome.Options().headless().windowSize({width, height}))
    .build()
})

/**
 * Use Case 1: 
 * 1 Administratören besöker sidan <url>
 * 2 Administratören trycker på länken "Today" i navigationsmenyn
 * 3 Administratören ser en lista med de anställda som har checkat in under dagen
 */
describe('UC 1: Checked in today', () => {
  beforeAll(async () => {
    await driver.get(rootUrl)
    await driver.findElement(By.tagName('nav'))
      .findElement(By.linkText('Today'))
      .click()
  })

  test(`Clicking 'Today' link takes you to ${rootUrl}/today`, async () => {
    expect(driver.getCurrentUrl()).resolves.toBe(`${rootUrl}/today`)
  })

  test('A list of employees is shown', async () => {
    const employees = await driver.findElement(By.className('employee-list'))
      .findElements(By.className('employee'))
    expect(employees).toHaveLength(5)
  })
})

 /**
 * Use Case 2:
 * 1 Administratören besöker sidan <url>/today
 * 2 Administratören trycker på en länk för en av de anställda
 * 3 Administratören ser detaljerad information om den anställda
 */
describe('UC2', () => {
  describe('Reading employee details', () => {
    beforeEach(async () => {
      await driver.get(`${rootUrl}/today`)
    })

    test('Link URL corresponds to employee ID', async () => {
      const employee = await driver.findElement(By.className('employee'))
      const [employeeID, employeeUrl] = await Promise.all([
        employee.getAttribute('employee-id'),
        employee.findElement(By.tagName('a')).getAttribute('href')])
      expect(employeeUrl).toBe(`${rootUrl}/employees/${employeeID}`)
    })

    test.each([['Fred Flintstone', 1], ['Barney Rubble', 2], ['Stoney Curtis', 5]])
	  ('%s link leads to stat page for id %d', async (name, id) => {
      await driver.findElement(By.linkText(name)).click()
      expect(driver.getCurrentUrl()).resolves.toBe(`${rootUrl}/employees/${id}`)
    })
  })

  describe('The stat page', () => {
    beforeAll(async () => {
      await driver.get(`${rootUrl}/employees/3`)
    })

    test.each([['employee-id', 'ID'], ['employee-name', 'Name'], ['worked-hours', 'Worked hours']])
	  ('Shows details for %s', async (statId, statText) => {
      const text = await driver.findElement(By.id(statId)).findElement(By.className('stat-category')).getText()
      expect(text).toBe(statText)
    })

    test.each([['employee-id', '3'], ['employee-name', 'Mr. Slate'], ['worked-hours', '38']])
	  ('Displays correct value for %s', async (statId, statValue) => {
      const text = await driver.findElement(By.id(statId))
        .findElement(By.className('stat-value'))
        .getText()
      expect(text).toBe(statValue)
    })

  })

})

afterAll(async () => {
  await driver.quit()
})
