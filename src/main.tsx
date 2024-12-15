import App from './App.tsx';
import { BrowserRouter } from "react-router";
import { createRoot } from 'react-dom/client';
import './index.css';

declare global {
    interface String {
        format(...args: string[] | number[]): string;
    }
}

String.prototype.format = function (...args: string[] | number[]): string {
    return this.replace(/{(\d+)}/g, (match, number) => {
        return (typeof args[number] != 'undefined') ? args[number] : match;
    });
}

createRoot(document.getElementById('root')!).render(
    <BrowserRouter>
        <App />
    </BrowserRouter>,
)
