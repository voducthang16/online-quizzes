export const API = {
    CLASS: {
        CREATE: 'classes',
        DELETE: 'classes/{0}',
        UPDATE: 'classes/{0}',
        GET_ALL: 'classes',
        GET_STUDENTS: 'classes/{0}/students',
        GET_TEACHERS: 'classes/{0}/teachers',
        GET_CLASS_BY_TEACHER: 'teachers/{0}/classes',
    },
    QUESTION_BANK: {
        CREATE: 'question-banks',
        DELETE: 'question-banks/{0}',
        UPDATE: 'question-banks/{0}',
        GET_ALL: 'question-banks',
        GET_QUESTION_BANK_BY_USER: 'question-banks/user/{0}',
        GET_DETAIL: 'question-banks/{0}',
    },
    USER: {
        LOGIN: 'users/login',
        REGISTER: 'users/register',
        GET_ALL: 'users',
        UPDATE: 'users/{0}',
    }
}