/**
 * Use Case 1: 
 * 1 Administratören besöker sidan <url>
 * 2 A trycker på länken "Today" i navigationsmenyn
 * 3 A ser en lista med de anställda som har checkat in under dagen
 */

 /**
 * Use Case 2:
 * 1 Administratören besöker sidan <url>/today
 * 2 A trycker på en länk för en av de anställda
 * 3 A ser detaljerad information om den anställda
 */

const {Builder, By} = require('selenium-webdriver')

let driver = null

beforeAll(() => {
	driver = new Builder().forBrowser('chrome').build()
})

describe('UC 1: Logged in today', () => {
	beforeEach(async () => {
		await driver.get('localhost:8080')
		await driver.findElement(By.tagName('nav'))
			.findElement(By.linkText('Today'))
			.click()
	})
	test('Clicking \'Today\' link takes you to <url>/today', async () => {
		expect(driver.getUrl()).resolves.toBe('localhost:8080/today')

	})
	test('A list of employees is shown', () => {
		let employees = await driver.findElement(By.className('employee-list')).findElements(By.className('employee'))
		expect(employees).toHaveLength(5)
	})
})

afterAll(async () => {
	await driver.quit()
})
