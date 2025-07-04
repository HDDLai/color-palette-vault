'use client';

import { useFormStatus } from 'react-dom';
import { addColorEntry, type State } from '@/lib/actions';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRef, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" aria-disabled={pending} className="w-full sm:w-auto">
      {pending ? 'Saving...' : 'Save'}
    </Button>
  );
}

export function ColorForm() {
  const [state, setState] = useState<State | undefined>(undefined);
  const formRef = useRef<HTMLFormElement>(null);
  const { toast } = useToast();
  const [color, setColor] = useState('#000000');

  const clientAction = async (formData: FormData) => {
    const result = await addColorEntry({ message: null, errors: {} }, formData);
    setState(result);

    if (result.message?.startsWith('Added')) {
      formRef.current?.reset();
      setColor('#000000');
    }
    
    if (result.message && (result.message.startsWith('Database Error') || result.message.startsWith('Invalid fields'))) {
      toast({
        title: 'Error',
        description: result.message,
        variant: 'destructive',
      });
    }
  };

  return (
    <form ref={formRef} action={clientAction} className="space-y-4">
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="name">Name</Label>
          <Input id="name" name="name" placeholder="e.g. Jane Doe" required />
          {state?.errors?.name &&
            state.errors.name.map((error: string) => (
              <p className="text-sm font-medium text-destructive" key={error}>
                {error}
              </p>
            ))}
        </div>
        <div className="space-y-2">
          <Label htmlFor="color">Favorite Color</Label>
          <div className="flex items-center gap-2">
            <Input
              id="color"
              name="color"
              type="color"
              className="h-10 w-12 cursor-pointer p-1"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
            <Input
              type="text"
              className="font-mono"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              pattern="^#[0-9a-fA-F]{6}$"
              title="Hex color code"
            />
          </div>
           {state?.errors?.color &&
            state.errors.color.map((error: string) => (
              <p className="text-sm font-medium text-destructive" key={error}>
                {error}
              </p>
            ))}
        </div>
      </div>
      <div className="flex justify-end">
        <SubmitButton />
      </div>
    </form>
  );
}
