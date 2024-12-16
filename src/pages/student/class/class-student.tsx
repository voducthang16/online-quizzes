import { toast } from 'sonner';
import { useState, useEffect } from "react";
import { ClassApi } from "@/api/page";
import { ClassModel } from "@/models";
import { LoadingSpinner } from "@/components";
import { StudentClassList } from './student-class-list';
import { useUserStore } from '@/stores';

const StudentClass = () => {
    const { userInfo } = useUserStore();
    return (
        <>
            <StudentClassList studentId={userInfo.user_id} />
        </>
    );
};

export default StudentClass;