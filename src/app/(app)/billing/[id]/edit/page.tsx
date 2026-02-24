import { prisma } from '@/lib/prisma';
import { InvoiceForm } from '@/app/(app)/billing/components/invoice-form';
import { notFound } from 'next/navigation';

export default async function EditInvoicePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const invoice = await prisma.invoice.findUnique({
    where: { id },
  });

  if (!invoice) {
    notFound();
  }

  return <InvoiceForm invoice={invoice} />;
}
