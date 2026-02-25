import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useAuth } from './AuthContext';

type Theme = 'light' | 'dark';
type ColorMode = 'green' | 'blue' | 'neutral';

interface ThemeContextType {
    theme: Theme;
    toggleTheme: () => void;
    colorMode: ColorMode;
    setColorMode: (mode: ColorMode) => void;
    primaryColor: string; // e.g. "text-green-600"
    secondaryColor: string; // e.g. "bg-green-100"
    accentColor: string; // e.g. "border-green-500"
    bgColor: string; // e.g. "bg-green-50"
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
    const { user } = useAuth();
    const [theme, setTheme] = useState<Theme>('light');
    const [manualColorMode, setManualColorMode] = useState<ColorMode | null>(null);

    // Automatically set color mode based on Auth User Role
    const colorMode: ColorMode = manualColorMode || (user?.role === 'farmer' ? 'green' : user?.role === 'customer' ? 'blue' : 'neutral');

    // Toggle Dark Mode
    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    // Apply dark mode class to html body
    useEffect(() => {
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
    }, [theme]);

    // Computed Color Classes
    const primaryColor = colorMode === 'green' ? 'text-green-600' : colorMode === 'blue' ? 'text-blue-600' : 'text-gray-900';
    const secondaryColor = colorMode === 'green' ? 'bg-green-100' : colorMode === 'blue' ? 'bg-blue-100' : 'bg-gray-100';
    const accentColor = colorMode === 'green' ? 'border-green-500' : colorMode === 'blue' ? 'border-blue-500' : 'border-gray-300';
    const bgColor = theme === 'dark'
        ? 'bg-gray-900'
        : (colorMode === 'green' ? 'bg-green-50' : colorMode === 'blue' ? 'bg-blue-50' : 'bg-gray-50');

    return (
        <ThemeContext.Provider value={{
            theme,
            toggleTheme,
            colorMode,
            setColorMode: setManualColorMode,
            primaryColor,
            secondaryColor,
            accentColor,
            bgColor
        }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};
