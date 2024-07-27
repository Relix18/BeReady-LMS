export default class ErrorHanlder extends Error {
    status;
    constructor(status, message) {
        super(message);
        this.status = status;
    }
}
