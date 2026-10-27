'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, type Resolver } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, Loader2, MapPin, Pencil, Plus, Star, Trash2, X } from 'lucide-react';
import { createAddressAction, deleteAddressAction, setDefaultAddressAction, updateAddressAction } from '@/actions/addresses';
import { addressSchema } from '@/lib/validation';
import { provinces } from '@/lib/constants';
import { cn } from '@/lib/utils';
import { Input, Select } from '@/components/ui/Field';
import { Dialog } from '@/components/ui/Dialog';

export type AddressItem = {
  id: string;
  recipient: string;
  phone: string;
  province: string;
  city: string;
  postalCode: string;
  street: string;
  label: string | null;
  isDefault: boolean;
};

type AddressValues = {
  recipient: string;
  phone: string;
  province: string;
  city: string;
  postalCode: string;
  street: string;
  label: string;
  isDefault: boolean;
};

function AddressForm({
  open,
  onClose,
  initial,
  onSaved,
}: {
  open: boolean;
  onClose: () => void;
  initial: AddressItem | null;
  onSaved: () => void;
}) {
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const form = useForm<AddressValues>({
    resolver: zodResolver(addressSchema) as unknown as Resolver<AddressValues>,
    defaultValues: {
      recipient: initial?.recipient ?? '',
      phone: initial?.phone ?? '',
      province: initial?.province ?? 'تهران',
      city: initial?.city ?? '',
      postalCode: initial?.postalCode ?? '',
      street: initial?.street ?? '',
      label: initial?.label ?? '',
      isDefault: initial?.isDefault ?? false,
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    setFormError(null);
    setSubmitting(true);
    const result = initial
      ? await updateAddressAction({ ...values, id: initial.id })
      : await createAddressAction(values);
    setSubmitting(false);

    if (!result.ok) {
      if (result.fieldErrors) {
        for (const [field, messages] of Object.entries(result.fieldErrors)) {
          if (field in values) form.setError(field as keyof AddressValues, { message: messages[0] });
        }
      }
      setFormError(result.message);
      return;
    }
    onSaved();
    onClose();
  });

  return (
    <Dialog open={open} onClose={onClose} labelledBy="address-form-title" className="border border-line bg-paper">
      <div className="max-h-[90dvh] overflow-y-auto p-6 sm:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id="address-form-title" className="display text-2xl">
              {initial ? 'ویرایش نشانی' : 'نشانی تازه'}
            </h2>
          </div>
          <button type="button" onClick={onClose} className="icon-btn" aria-label="بستن فرم نشانی">
            <X aria-hidden="true" className="size-5" />
          </button>
        </div>

        <form onSubmit={onSubmit} noValidate className="mt-6 space-y-4">
          {formError ? (
            <p role="alert" className="border-s-2 border-error bg-error/5 px-4 py-3 text-sm text-error">
              {formError}
            </p>
          ) : null}

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="نام گیرنده"
              autoComplete="name"
              error={form.formState.errors.recipient?.message}
              {...form.register('recipient')}
            />
            <Input
              label="شمارهٔ همراه"
              inputMode="tel"
              dir="ltr"
              placeholder="09xxxxxxxxx"
              autoComplete="tel"
              error={form.formState.errors.phone?.message}
              {...form.register('phone')}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Select
              label="استان"
              error={form.formState.errors.province?.message}
              {...form.register('province')}
            >
              {provinces.map((province) => (
                <option key={province} value={province}>
                  {province}
                </option>
              ))}
            </Select>
            <Input
              label="شهر"
              error={form.formState.errors.city?.message}
              {...form.register('city')}
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label="کد پستی"
              inputMode="numeric"
              dir="ltr"
              placeholder="1234567890"
              autoComplete="postal-code"
              error={form.formState.errors.postalCode?.message}
              {...form.register('postalCode')}
            />
            <Input
              label="برچسب (اختیاری)"
              placeholder="خانه، محل کار…"
              error={form.formState.errors.label?.message}
              {...form.register('label')}
            />
          </div>

          <Input
            label="نشانی کامل"
            placeholder="خیابان، کوچه، پلاک، واحد"
            autoComplete="street-address"
            error={form.formState.errors.street?.message}
            {...form.register('street')}
          />

          <label htmlFor="address-default" className="flex cursor-pointer items-center gap-3 text-sm text-ink-soft">
            <span
              className={cn(
                'flex size-5 items-center justify-center border',
                form.watch('isDefault') ? 'border-plum bg-plum text-paper' : 'border-line bg-paper-soft',
              )}
            >
              {form.watch('isDefault') ? <Check aria-hidden="true" className="size-3" /> : null}
            </span>
            <input id="address-default" type="checkbox" className="sr-only" {...form.register('isDefault')} />
            این نشانی پیش‌فرض باشد
          </label>

          <div className="flex gap-3 pt-2">
            <button type="submit" disabled={submitting} className="btn btn-primary flex-1">
              {submitting ? <Loader2 aria-hidden="true" className="size-4 animate-spin" /> : null}
              {initial ? 'ذخیرهٔ تغییرات' : 'افزودن نشانی'}
            </button>
            <button type="button" onClick={onClose} className="btn btn-outline">
              انصراف
            </button>
          </div>
        </form>
      </div>
    </Dialog>
  );
}

export function AddressManager({ addresses, next }: { addresses: AddressItem[]; next: string | null }) {
  const router = useRouter();
  const [formOpen, setFormOpen] = useState(addresses.length === 0);
  const [editing, setEditing] = useState<AddressItem | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = () => {
    router.refresh();
    if (next) router.push('/checkout');
  };

  const makeDefault = async (id: string) => {
    setPending(true);
    setError(null);
    const result = await setDefaultAddressAction(id);
    setPending(false);
    if (!result.ok) setError(result.message);
    else router.refresh();
  };

  const remove = async (id: string) => {
    setPending(true);
    setError(null);
    const result = await deleteAddressAction(id);
    setPending(false);
    if (!result.ok) setError(result.message);
    else {
      setConfirmDelete(null);
      router.refresh();
    }
  };

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-6">
        <div>
          <h1 className="display text-3xl">نشانی‌های من</h1>
          <p className="mt-2 text-sm text-ink-soft">
            نشانی‌ها فقط برای همین حساب ذخیره می‌شوند و در تکمیل سفارش انتخاب می‌شوند.
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditing(null);
            setFormOpen(true);
          }}
          className="btn btn-primary btn-sm"
        >
          <Plus aria-hidden="true" className="size-4" />
          نشانی تازه
        </button>
      </div>

      {next ? (
        <p className="mt-5 border-s-2 border-gold bg-paper-deep/60 px-4 py-3 text-xs leading-6 text-ink-soft">
          برای ادامهٔ سفارش، یک نشانی انتخاب یا ثبت کن. بعد از ذخیره به تکمیل سفارش برمی‌گردی.
        </p>
      ) : null}

      {error ? (
        <p role="alert" className="mt-5 border-s-2 border-error bg-error/5 px-4 py-3 text-sm text-error">
          {error}
        </p>
      ) : null}

      {addresses.length === 0 ? (
        <div className="mt-8 flex flex-col items-center border border-dashed border-line px-6 py-14 text-center">
          <MapPin aria-hidden="true" className="size-7 text-gold" />
          <p className="mt-4 font-display text-2xl text-plum-ink">هنوز نشانی‌ای ثبت نکردی.</p>
          <p className="mt-2 max-w-sm text-sm leading-7 text-ink-soft">
            برای ثبت سفارش به یک نشانی نیاز داری. می‌توانی هر زمان آن را ویرایش کنی.
          </p>
          <button type="button" onClick={() => setFormOpen(true)} className="btn btn-primary mt-6">
            افزودن نشانی
          </button>
        </div>
      ) : (
        <ul className="mt-8 grid gap-4 md:grid-cols-2">
          {addresses.map((address) => (
            <li key={address.id} className="flex flex-col border border-line bg-paper-soft p-5">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="flex flex-wrap items-center gap-2 text-sm font-medium text-plum-ink">
                    {address.recipient}
                    {address.label ? <span className="badge badge-soft">{address.label}</span> : null}
                  </p>
                  <p className="mt-2 text-sm leading-7 text-ink-soft">
                    {address.province}، {address.city}
                    <br />
                    {address.street}
                  </p>
                  <p className="mt-1 text-[0.68rem] text-ink-soft" dir="ltr">
                    {address.phone} · {address.postalCode}
                  </p>
                </div>
                {address.isDefault ? (
                  <span className="flex items-center gap-1 text-[0.62rem] text-gold">
                    <Star aria-hidden="true" className="size-3 fill-current" />
                    پیش‌فرض
                  </span>
                ) : null}
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-line pt-4 text-xs">
                {!address.isDefault ? (
                  <button
                    type="button"
                    disabled={pending}
                    onClick={() => makeDefault(address.id)}
                    className="text-ink-soft transition-colors hover:text-plum"
                  >
                    انتخاب به‌عنوان پیش‌فرض
                  </button>
                ) : null}
                <button
                  type="button"
                  onClick={() => {
                    setEditing(address);
                    setFormOpen(true);
                  }}
                  className="flex items-center gap-1 text-ink-soft transition-colors hover:text-plum"
                >
                  <Pencil aria-hidden="true" className="size-3.5" />
                  ویرایش
                </button>
                {confirmDelete === address.id ? (
                  <span className="flex items-center gap-2">
                    <span className="text-[0.68rem] text-ink-soft">حذف شود؟</span>
                    <button
                      type="button"
                      disabled={pending}
                      onClick={() => remove(address.id)}
                      className="text-error underline-offset-4 hover:underline"
                    >
                      بله، حذف
                    </button>
                    <button
                      type="button"
                      onClick={() => setConfirmDelete(null)}
                      className="text-ink-soft underline-offset-4 hover:underline"
                    >
                      انصراف
                    </button>
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => setConfirmDelete(address.id)}
                    className="flex items-center gap-1 text-ink-soft transition-colors hover:text-error"
                  >
                    <Trash2 aria-hidden="true" className="size-3.5" />
                    حذف
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      )}

      {formOpen ? (
        <AddressForm
          open={formOpen}
          onClose={() => setFormOpen(false)}
          initial={editing}
          onSaved={refresh}
        />
      ) : null}
    </div>
  );
}
