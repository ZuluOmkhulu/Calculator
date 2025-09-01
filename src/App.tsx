import React, { useState } from 'react';
import { Delete, RotateCcw } from 'lucide-react';

function App() {
  const [display, setDisplay] = useState('0');
  const [previousValue, setPreviousValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const inputNumber = (num: string) => {
    if (waitingForOperand) {
      setDisplay(num);
      setWaitingForOperand(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const inputDecimal = () => {
    if (waitingForOperand) {
      setDisplay('0.');
      setWaitingForOperand(false);
    } else if (display.indexOf('.') === -1) {
      setDisplay(display + '.');
    }
  };

  const clear = () => {
    setDisplay('0');
    setPreviousValue(null);
    setOperation(null);
    setWaitingForOperand(false);
  };

  const deleteDigit = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  const performOperation = (nextOperation: string) => {
    const inputValue = parseFloat(display);

    if (previousValue === null) {
      setPreviousValue(inputValue);
    } else if (operation) {
      const currentValue = previousValue || 0;
      const newValue = calculate(currentValue, inputValue, operation);

      if (newValue === null) {
        setDisplay('Error');
        setPreviousValue(null);
        setOperation(null);
        setWaitingForOperand(true);
        return;
      }

      setDisplay(String(newValue));
      setPreviousValue(newValue);
    }

    setWaitingForOperand(true);
    setOperation(nextOperation);
  };

  const calculate = (firstValue: number, secondValue: number, operation: string): number | null => {
    switch (operation) {
      case '+':
        return firstValue + secondValue;
      case '-':
        return firstValue - secondValue;
      case '*':
        return firstValue * secondValue;
      case '/':
        return secondValue !== 0 ? firstValue / secondValue : null;
      default:
        return secondValue;
    }
  };

  const Button = ({ 
    onClick, 
    className = '', 
    children, 
    variant = 'default' 
  }: { 
    onClick: () => void; 
    className?: string; 
    children: React.ReactNode;
    variant?: 'default' | 'operator' | 'equals' | 'clear' | 'delete';
  }) => {
    const baseClasses = 'h-16 rounded-xl font-semibold text-lg transition-all duration-200 active:scale-95 shadow-lg';
    const variants = {
      default: 'bg-white hover:bg-gray-50 text-gray-900 shadow-gray-200',
      operator: 'bg-blue-500 hover:bg-blue-600 text-white shadow-blue-300',
      equals: 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-300',
      clear: 'bg-red-500 hover:bg-red-600 text-white shadow-red-300',
      delete: 'bg-orange-500 hover:bg-orange-600 text-white shadow-orange-300'
    };

    return (
      <button
        onClick={onClick}
        className={`${baseClasses} ${variants[variant]} ${className}`}
      >
        {children}
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 flex items-center justify-center p-4">
      <div className="bg-white/10 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
        <div className="w-80">
          {/* Display */}
          <div className="bg-gray-900 rounded-2xl p-6 mb-6 shadow-inner">
            <div className="text-right">
              <div className="text-4xl font-light text-white overflow-hidden">
                {display}
              </div>
              {operation && previousValue !== null && (
                <div className="text-sm text-gray-400 mt-1">
                  {previousValue} {operation}
                </div>
              )}
            </div>
          </div>

          {/* Button Grid */}
          <div className="grid grid-cols-4 gap-3">
            {/* First Row */}
            <Button variant="clear" onClick={clear}>
              <RotateCcw size={20} />
            </Button>
            <Button variant="delete" onClick={deleteDigit}>
              <Delete size={20} />
            </Button>
            <Button variant="operator" onClick={() => performOperation('/')}>
              ÷
            </Button>
            <Button variant="operator" onClick={() => performOperation('*')}>
              ×
            </Button>

            {/* Second Row */}
            <Button onClick={() => inputNumber('7')}>7</Button>
            <Button onClick={() => inputNumber('8')}>8</Button>
            <Button onClick={() => inputNumber('9')}>9</Button>
            <Button variant="operator" onClick={() => performOperation('-')}>
              −
            </Button>

            {/* Third Row */}
            <Button onClick={() => inputNumber('4')}>4</Button>
            <Button onClick={() => inputNumber('5')}>5</Button>
            <Button onClick={() => inputNumber('6')}>6</Button>
            <Button variant="operator" onClick={() => performOperation('+')}>
              +
            </Button>

            {/* Fourth Row */}
            <Button onClick={() => inputNumber('1')}>1</Button>
            <Button onClick={() => inputNumber('2')}>2</Button>
            <Button onClick={() => inputNumber('3')}>3</Button>
            <Button 
              variant="equals" 
              onClick={() => performOperation('=')}
              className="row-span-2"
            >
              =
            </Button>

            {/* Fifth Row */}
            <Button onClick={() => inputNumber('0')} className="col-span-2">
              0
            </Button>
            <Button onClick={inputDecimal}>.</Button>
          </div>
        </div>

        {/* Title */}
        <div className="text-center mt-6">
          <h1 className="text-white/80 text-lg font-medium">Calculator</h1>
        </div>
      </div>
    </div>
  );
}

export default App;