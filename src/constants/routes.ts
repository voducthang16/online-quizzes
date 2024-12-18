export const ROUTES = {
    DASHBOARD: '',
    USER: 'user',
    SUBJECT: 'subject',
    CLASS: 'class',
    BANK: 'bank',
    EXAM: 'exam',
    QUESTION: 'question',
    LOGIN: 'login',
    UNAUTHORIZED: 'unauthorized',
    NOT_FOUND: '*',
    CLASS_ROUTE: {
        DETAIL: ':id',
        TAKE_EXAM: 'take-exam/:examId',
        VIEW_RESULT: 'view-result/:examId',
        VIEW_DETAIL: 'view-detail/:examId',
    },
};
