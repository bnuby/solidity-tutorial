// contract test code will go here
const assert = require('assert');
const ganache = require('ganache-cli');
const { describe, it, beforeEach } = require('mocha');
const Web3 = require('web3');
/**
 * @type import('web3').default
 */
const web3 = new Web3(ganache.provider());

const { interface, bytecode } = require('../compile');

class Car {
    park() {
        return 'stopped';
    }
    drive() {
        return 'vroom';
    }
}

let car;
/**
 * @type import('web3-eth-contract').Contract;
 */
let inbox;
/**
 * @type string[]
 */
let accounts;

const text = 'Hi there!';

beforeEach(async () => {
    car = new Car();
    accounts = await web3.eth.getAccounts();

    inbox = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({
            data: bytecode,
            arguments: [text],
        })
        .send({ from: accounts[0], gas: '1000000' });
});

describe('Inbox Contract', () => {
    it('deploy a contract', () => {
        console.log({
            address: inbox.options.address,
        });
        assert.ok(inbox.options.address);
    });

    it('has a default message', async () => {
        const message = await inbox.methods.message().call();
        assert.equal(message, text);
        console.log(`${message} is matched the expected value (${text})`);
    });

    it('set new message', async () => {
        await inbox.methods.setMessage('Message').send({
            from: accounts[0],
        });
        const message = await inbox.methods.message().call();
        console.log(message);
        assert.equal(message, 'Message');
    });
});

describe('Car', function () {
    it('Test Park', () => {
        assert.equal(car.park(), 'stopped');
    });

    it('Test Drive', () => {
        assert.equal(car.drive(), 'vroom');
    });
});
