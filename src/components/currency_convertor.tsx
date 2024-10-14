"use client";

import { useState, useEffect, ChangeEvent } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import ClipLoader from "react-spinners/ClipLoader";

type ExchangeRates = {
  [key: string]: number;
};

type Currency = "USD" | "EUR" | "GBP" | "JPY" | "AUD" | "CAD" | "PKR";

export default function CurrencyConverter() {
  const [amount, setAmount] = useState<number | null>(null);
  const [sourceCurrency, setSourceCurrency] = useState<Currency>("USD");
  const [targetCurrency, setTargetCurrency] = useState<Currency>("PKR");
  const [exchangeRates, setExchangeRates] = useState<ExchangeRates>({});
  const [convertedAmount, setConvertedAmount] = useState<string>("0.00");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchExchangeRates = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          "https://api.exchangerate-api.com/v4/latest/USD"
        );
        const data = await response.json();
        setExchangeRates(data.rates);
      } catch (error) {
        setError("Error fetching exchange rates.");
      } finally {
        setLoading(false);
      }
    };
    fetchExchangeRates();
  }, []);

  const handleAmountChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setAmount(parseFloat(e.target.value));
  };

  const handleSourceCurrencyChange = (value: Currency): void => {
    setSourceCurrency(value);
  };

  const handleTargetCurrencyChange = (value: Currency): void => {
    setTargetCurrency(value);
  };

  const calculateConvertedAmount = (): void => {
    if (sourceCurrency && targetCurrency && amount && exchangeRates) {
      const rate =
        sourceCurrency === "USD"
          ? exchangeRates[targetCurrency]
          : exchangeRates[targetCurrency] / exchangeRates[sourceCurrency];
      const result = amount * rate;
      setConvertedAmount(result.toFixed(2));
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[url('https://i.pinimg.com/564x/14/1e/03/141e03b63e5b95a7f0b9de3d55721885.jpg')] bg-cover">
      <Card className="w-full max-w-md p-6 space-y-4 bg-purple-500 border-purple-900 bg-opacity-80">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold text-white">Currency Converter</CardTitle>
          <CardDescription className="text-white">Convert between different currencies.</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center">
              <ClipLoader className="w-6 h-6 text-white" />
            </div>
          ) : (
            <div className="grid gap-4">
              {error ? (
                <div className="text-red-500 text-center">{error}</div>
              ) : (
                <>
                  <div className="grid grid-cols-[1fr_auto] items-center gap-2">
                    <Label htmlFor="from" className="text-white">From</Label>
                    <div className="grid grid-cols-[1fr_auto] items-center gap-2">
                      <Input
                        type="number"
                        placeholder="Amount"
                        value={amount || ""}
                        onChange={handleAmountChange}
                        className="w-full"
                        id="from"
                      />
                      <Select
                        value={sourceCurrency}
                        onValueChange={handleSourceCurrencyChange}
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue placeholder="USD" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="USD">USD</SelectItem>
                            <SelectItem value="EUR">EUR</SelectItem>
                            <SelectItem value="GBP">GBP</SelectItem>
                            <SelectItem value="JPY">JPY</SelectItem>
                            <SelectItem value="AUD">AUD</SelectItem>
                            <SelectItem value="CAD">CAD</SelectItem>
                            <SelectItem value="PKR">PKR</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-[1fr_auto] items-center gap-2">
                    <Label htmlFor="to" className="text-gray-800">To</Label>
                    <div className="grid grid-cols-[1fr_auto] items-center gap-2">
                      <div className="text-2xl font-bold text-gray-800">{convertedAmount}</div>
                      <Select
                        value={targetCurrency}
                        onValueChange={handleTargetCurrencyChange}
                      >
                        <SelectTrigger className="w-24">
                          <SelectValue placeholder="EUR" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectGroup>
                            <SelectItem value="USD">USD</SelectItem>
                            <SelectItem value="EUR">EUR</SelectItem>
                            <SelectItem value="GBP">GBP</SelectItem>
                            <SelectItem value="JPY">JPY</SelectItem>
                            <SelectItem value="AUD">AUD</SelectItem>
                            <SelectItem value="CAD">CAD</SelectItem>
                            <SelectItem value="PKR">PKR</SelectItem>
                          </SelectGroup>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}
        </CardContent>
        <CardFooter>
          <Button
            type="button"
            className="w-full bg-purple-600 text-white hover:bg-purple-700"
            onClick={calculateConvertedAmount}
          >
            Convert
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
