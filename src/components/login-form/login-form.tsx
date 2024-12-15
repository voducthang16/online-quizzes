import { toast } from 'sonner';
import { useState } from 'react';
import { UserApi } from '@/api/page';
import { useUserStore } from '@/stores';
import { Lock, Mail } from 'lucide-react';
import { useNavigate } from 'react-router';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

export const LoginForm = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const { setUserInfo } = useUserStore();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await UserApi.login({
                payload: {
                    email,
                    password,
                },
            });

            const data = response.data.data;
            const error = response.data.code;

            if (!error) {
                setUserInfo({
                    full_name: data.full_name,
                    email: data.email,
                    role: data.role,
                    user_id: data.user_id,
                });

                toast.success('Login Successful', {
                    description: `Welcome, ${data.full_name}!`
                });

                navigate('/', { replace: true });
            }
        } catch (error: any) {
            toast.error('Login Failed', {
                description: error?.message || 'Invalid email or password'
            });
        } finally {
            setIsLoading(false);
        }
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
                                disabled={isLoading}
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
                                disabled={isLoading}
                            />
                        </div>
                    </div>
                </CardContent>
                <CardFooter>
                    <Button type="submit" className="w-full" disabled={isLoading}>
                        {isLoading ? 'Logging in...' : 'Login'}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
};