'use client';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { clearAllEntries } from '@/lib/actions';
import type { ColorEntry } from '@/lib/types';
import { Trash2 } from 'lucide-react';
import { useFormStatus } from 'react-dom';
import { useEffect, useState } from 'react';

function ClearButton() {
    const { pending } = useFormStatus();
    return (
        <AlertDialogAction type="submit" disabled={pending}>
            {pending ? 'Clearing...' : 'Continue'}
        </AlertDialogAction>
    );
}

export function ColorList({ entries }: { entries: ColorEntry[] }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center border border-dashed p-12 text-center">
        <h3 className="text-xl font-medium">No Colors Saved</h3>
        <p className="text-sm text-muted-foreground">
          Add a name and a color to get started.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Saved Colors</h2>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" size="sm">
              <Trash2 className="mr-2 h-4 w-4" />
              Clear All
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <form action={clearAllEntries}>
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription>
                  This action cannot be undone. This will permanently delete all
                  color entries from the database.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <ClearButton />
              </AlertDialogFooter>
            </form>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      <div className="border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[120px]">Color</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Added</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {entries.map((entry) => (
              <TableRow key={entry.id}>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <div
                      className="h-6 w-6 border"
                      style={{ backgroundColor: entry.color }}
                    />
                    <span className="font-mono text-xs">{entry.color}</span>
                  </div>
                </TableCell>
                <TableCell className="font-medium">{entry.name}</TableCell>
                <TableCell className="text-right text-xs text-muted-foreground">
                   {isClient ? new Date(entry.createdAt).toLocaleDateString() : null}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
