
"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Gem, Wallet, DollarSign, PlusCircle, PartyPopper, Frown } from "lucide-react";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";

const SLOT_NUMBERS = [0, 9, 1, 5, 2];
const INITIAL_BALANCE = 0;
const BID_OPTIONS: {[key: number]: number | 'ALL IN'} = {1:1000,2:2500,3:5000,4:10000,5:50000,6:100000,7:'ALL IN'};

export default function GambleVerse() {
  const [balance, setBalance] = useState(INITIAL_BALANCE);
  const [bidOption, setBidOption] = useState<number>(1);
  const [depositAmount, setDepositAmount] = useState(100);

  const [isSpinning, setIsSpinning] = useState(false);
  const [slotValues, setSlotValues] = useState([1, 1, 1]);
  
  const [gameResult, setGameResult] = useState<"win" | "loss" | null>(null);
  const [isDepositOpen, setIsDepositOpen] = useState(false);
  const [payout, setPayout] = useState(0);

  const { toast } = useToast();

  useEffect(() => {
    if (gameResult) {
      const timer = setTimeout(() => {
        setGameResult(null);
      }, 4000); // Reset after 4 seconds
      return () => clearTimeout(timer);
    }
  }, [gameResult]);

  const handleDeposit = () => {
    if (depositAmount > 0) {
      setBalance((prev) => prev + depositAmount);
      toast({
        title: "Deposit Successful",
        description: `$${depositAmount.toLocaleString()} has been added to your balance.`,
      });
      setIsDepositOpen(false);
      setDepositAmount(100);
    }
  };

  const handleSpin = () => {
    const bidValue = BID_OPTIONS[bidOption];
    const currentBidAmount = bidValue === 'ALL IN' ? balance : bidValue;

    if (currentBidAmount <= 0) {
        toast({
            variant: "destructive",
            title: "Invalid Bet",
            description: "Please place a valid bid.",
        });
        return;
    }

    if (currentBidAmount > balance) {
       toast({
        variant: "destructive",
        title: "Insufficient Funds",
        description: "Your bid cannot be greater than your balance.",
      });
      return;
    }

    setIsSpinning(true);
    setGameResult(null);
    setBalance((prev) => prev - currentBidAmount);

    let spinCount = 0;
    const maxSpins = 30; // Control duration of spin
    const interval = setInterval(() => {
      setSlotValues([
          SLOT_NUMBERS[Math.floor(Math.random() * SLOT_NUMBERS.length)],
          SLOT_NUMBERS[Math.floor(Math.random() * SLOT_NUMBERS.length)],
          SLOT_NUMBERS[Math.floor(Math.random() * SLOT_NUMBERS.length)],
      ]);
      spinCount++;
      if (spinCount > maxSpins) {
        clearInterval(interval);
        const finalSlotValues = [
            SLOT_NUMBERS[Math.floor(Math.random() * SLOT_NUMBERS.length)],
            SLOT_NUMBERS[Math.floor(Math.random() * SLOT_NUMBERS.length)],
            SLOT_NUMBERS[Math.floor(Math.random() * SLOT_NUMBERS.length)],
        ];
        setSlotValues(finalSlotValues);

        const [s1, s2, s3] = finalSlotValues;
        if (s1 === s2 && s2 === s3) {
          const winMultiplier = s1 === 0 ? 10 : s1;
          const calculatedPayout = currentBidAmount * winMultiplier;
          setPayout(calculatedPayout);
          setBalance((prev) => prev + calculatedPayout);
          setGameResult("win");
        } else {
          setGameResult("loss");
        }
        setIsSpinning(false);
      }
    }, 100);
  };
  
  return (
    <div className="flex flex-col gap-8">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Gem className="h-10 w-10 text-primary animate-pulse-glow" />
          <h1 className="font-headline text-3xl md:text-4xl tracking-wider text-primary animate-pulse-glow">
            VIT GambleVerse
          </h1>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Center Column - Wheel */}
        <div className="lg:col-span-2 order-1 w-full">
            <Card className="aspect-video flex flex-col items-center justify-center p-6 bg-card/80 backdrop-blur-sm shadow-2xl shadow-primary/20 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-black" />
                <CardHeader className="items-center pb-2 z-10">
                    <CardTitle className="font-headline text-2xl text-primary tracking-widest">
                        {isSpinning ? 'SPINNING' : gameResult ? 'RESULT' : 'SLOTS'}
                    </CardTitle>
                     <CardDescription className="font-headline text-xs text-muted-foreground">The Greatest Gamble of VIT</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex items-center justify-center gap-2 md:gap-4 overflow-hidden z-10">
                    {slotValues.map((val, i) => (
                      <div key={i} className="relative h-28 w-20 md:h-36 md:w-28 rounded-lg bg-black/30 flex items-center justify-center overflow-hidden border-2 border-primary/20 shadow-inner shadow-black/50">
                          <div className="absolute inset-0 bg-gradient-to-b from-card/80 via-transparent to-card/80 opacity-50" />
                          {isSpinning ? (
                            <div className="absolute inset-0 flex flex-col items-center justify-start reel-spinning-fast">
                                {[...SLOT_NUMBERS, ...SLOT_NUMBERS, ...SLOT_NUMBERS].map((num, index) => (
                                  <div key={index} className="flex h-full w-full shrink-0 items-center justify-center text-7xl md:text-8xl font-headline font-black text-accent drop-shadow-[0_0_10px_hsl(var(--accent))]">
                                      {num}
                                  </div>
                                ))}
                            </div>
                          ) : (
                              <div className="text-7xl md:text-8xl font-headline font-black text-accent drop-shadow-[0_0_10px_hsl(var(--accent))]">
                                  {val}
                              </div>
                          )}
                      </div>
                    ))}
                </CardContent>
                {gameResult && (
                    <CardFooter className="w-full z-10">
                        <Alert variant={gameResult === 'win' ? 'default' : 'destructive'} className={cn('backdrop-blur-sm', gameResult === 'win' && 'border-accent bg-accent/10 text-accent')}>
                            {gameResult === 'win' ? <PartyPopper className="h-4 w-4" /> : <Frown className="h-4 w-4" />}
                            <AlertTitle className="font-headline">{gameResult === 'win' ? `You Won $${payout.toLocaleString()}!` : 'You Lost!'}</AlertTitle>
                            <AlertDescription>
                               {gameResult === 'win' ? `BAANNGGG Mr.LUCKY !!!` : `U LLOOSTTTT Mr.UNLUCKY`}
                            </AlertDescription>
                        </Alert>
                    </CardFooter>
                )}
            </Card>
        </div>

        {/* Right Column - Controls */}
        <div className="flex flex-col gap-8 lg:col-span-1 order-2 w-full">
          <Card className="shadow-lg shadow-primary/10">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 font-headline">
                <Wallet className="text-accent" />
                Your Wallet
              </CardTitle>
            </CardHeader>
            <CardContent className="flex items-center justify-between gap-4">
              <span className="text-3xl md:text-4xl font-bold font-headline text-accent">
                ${balance.toLocaleString()}
              </span>
               <Dialog open={isDepositOpen} onOpenChange={setIsDepositOpen}>
                <DialogTrigger asChild>
                  <Button variant="outline" className="border-accent text-accent hover:bg-accent hover:text-accent-foreground">
                    <PlusCircle className="mr-2 h-4 w-4" /> Deposit
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="font-headline">Deposit Funds</DialogTitle>
                    <DialogDescription>
                      Enter the amount you want to deposit.
                    </DialogDescription>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                     <div className="relative">
                        <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                            type="number"
                            value={depositAmount}
                            onChange={(e) => setDepositAmount(Number(e.target.value))}
                            className="pl-10 font-headline"
                            min="1"
                        />
                     </div>
                  </div>
                  <DialogFooter>
                    <Button onClick={handleDeposit} className="w-full font-headline">Deposit ${depositAmount > 0 ? depositAmount.toLocaleString() : ''}</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
          
          <Card className="shadow-lg shadow-primary/10">
            <CardHeader>
                <CardTitle className="font-headline">Place Your Bet</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="grid grid-cols-3 md:grid-cols-4 gap-2">
                    {Object.entries(BID_OPTIONS).map(([key, value]) => (
                        <Button 
                            key={key}
                            variant={bidOption === Number(key) ? "default" : "secondary"} 
                            onClick={() => setBidOption(Number(key))} 
                            disabled={isSpinning || gameResult !== null}
                            className="font-headline"
                        >
                            {typeof value === 'number' ? `$${(value/1000)}k` : value}
                        </Button>
                    ))}
                </div>
                 <Button className="w-full text-lg py-6 font-bold shadow-lg shadow-primary/30 transition-all hover:shadow-primary/50 font-headline" onClick={handleSpin} disabled={isSpinning || gameResult !== null}>
                    {isSpinning ? 'Spinning...' : 'SPIN THE WHEEL'}
                </Button>
            </CardContent>
          </Card>
           <Card className="shadow-lg shadow-primary/10 h-full">
                <CardHeader>
                    <CardTitle className="font-headline">How To Play</CardTitle>
                    <CardDescription>Rules of the game.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 text-sm text-muted-foreground">
                    <p>1. Deposit funds into your wallet to start.</p>
                    <p>2. Select a bid amount from the available options.</p>
                    <p>3. Press "SPIN THE WHEEL" to start the game.</p>
                    <p>4. If all three numbers in the slots match, you win!</p>
                    <p className="font-bold text-foreground">Payouts:</p>
                    <ul className="list-disc pl-5 space-y-1 font-body">
                        <li>Match any number (1, 2, 5, 9): <span className="text-accent font-headline">Bid x Matched Number</span></li>
                        <li>Match three 0s: <span className="text-accent font-headline">Bid x 10</span></li>
                    </ul>
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
