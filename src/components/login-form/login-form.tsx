import { toast } from 'sonner';
import { useState } from 'react';
import { ROLE } from '@/constants';
import { useUserStore } from '@/stores';
import { useNavigate } from 'react-router';
import { Lock, Mail } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const FAKE_USERS = [
    {
        email: 'admin@example.com',
        password: 'admin123',
        fullName: 'Admin User',
        role: ROLE.ADMIN,
    },
    {
        email: 'teacher@example.com',
        password: 'teacher123',
        fullName: 'Teacher User',
        role: ROLE.TEACHER,
    },
    {
        email: 'student@example.com',
        password: 'student123',
        fullName: 'Student User',
        role: ROLE.STUDENT,
    }
];

export const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { setUserInfo } = useUserStore();
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const foundUser = FAKE_USERS.find(
            user => user.email === email && user.password === password
        );

        if (foundUser) {
            setUserInfo({
                fullName: foundUser.fullName,
                email: foundUser.email,
                role: foundUser.role,
            });

            toast.success('Login Successful', {
                description: `Welcome, ${foundUser.fullName}!`
            });

            navigate('/', { replace: true });
        } else {
            toast.error('Login Failed', {
                description: 'Invalid email or password'
            });
        }
    };

    const copyToClipboard = (text: string, type: 'email' | 'password') => {
        navigator.clipboard.writeText(text);
        toast.success(`${type} copied to clipboard!`);
    };

    return (
        <Card className="w-full max-w-md shadow-lg">
            <CardHeader>
                <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <div className="relative">
                            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                            <Input
                                id="email"
                                type="email"
                                placeholder="Enter your email"
                                className="pl-10"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <div className="relative">
                            <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={20} />
                            <Input
                                id="password"
                                type="password"
                                placeholder="Enter your password"
                                className="pl-10"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div className="text-center text-sm text-gray-600">
                        <p>Test Credentials:</p>
                        {FAKE_USERS.map((user) => (
                            <div key={user.email} className="space-x-2">
                                <span 
                                    className="cursor-pointer hover:text-blue-500"
                                    onClick={() => copyToClipboard(user.email, 'email')}
                                >
                                    {user.email}
                                </span>
                                <span>/</span>
                                <span 
                                    className="cursor-pointer hover:text-blue-500"
                                    onClick={() => copyToClipboard(user.password, 'password')}
                                >
                                    {user.password}
                                </span>
                            </div>
                        ))}
                    </div>
                </CardContent>
                <CardFooter>
                    <Button type="submit" className="w-full">
                        Login
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
};