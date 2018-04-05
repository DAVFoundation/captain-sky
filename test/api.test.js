const zmq = require('zmq');
const should = require('should');

describe('socket', function () {
    let sock;

    afterEach(() => {
        if(typeof sock !== 'undefined') {
            sock.close();
        }
    });

    it('should alias socket', function () {
        zmq
            .createSocket
            .should
            .equal(zmq.socket);
    });

    it('should include type and close', function () {
        sock = zmq.socket('req');
        sock
            .type
            .should
            .equal('req');
        sock.close.should.be.a.Function;
    });
});
