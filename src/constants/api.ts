export const API = {
    CLASS: {
        CREATE: 'classes',
        DELETE: 'classes/{0}',
        UPDATE: 'classes/{0}',
        GET_ALL: 'classes',
        GET_DETAIL: 'classes/{0}',
        GET_STUDENTS: 'classes/{0}/students',
        GET_TEACHERS: 'classes/{0}/teachers',
        GET_CLASS_BY_TEACHER: 'classes/teachers/{0}/classes',
        GET_CLASS_STUDENT_ENROLL: 'classes/students/{0}',
        REMOVE_STUDENT: 'classes/{0}/students/{1}',
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
        GET_ALL_TEACHERS: 'users/teachers',
        GET_ALL_STUDENTS: 'users/students',
    },
    SUBJECT: {
        CREATE: 'subjects',
        DELETE: 'subjects/{0}',
        UPDATE: 'subjects/{0}',
        GET_ALL: 'subjects',
        GET_DETAIL: 'subjects/{0}',
    },
    EXAM: {
        CREATE: 'exams',
        UPDATE: 'exams/{0}',
        GET_ALL: 'exams',
        DETAIL: 'exams/{0}',
        GET_EXAM_BY_CLASS_ID: 'exams/class/{0}',
        GET_EXAM_BY_USER_ID: 'exams/user/{0}',
    },
    QUESTION_LIST: {
        GET_ALL: 'questions',
        CREATE: 'questions',
        DELETE: 'questions/{0}',
        UPDATE: 'questions/{0}',
        UPLOAD: 'questions/upload',
        GET_QUESTION_BY_USER_ID: 'questions/user/{0}',
    },
    RESULT: {
        SUBMIT: 'results',
    },
    STATISTIC: {
        GET_STATISTIC: 'statistics',
    },
}