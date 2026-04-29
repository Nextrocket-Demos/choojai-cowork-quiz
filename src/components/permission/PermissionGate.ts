import { el } from '../ui/dom';
import { Button } from '../ui/Button';
import { startSelfieCamera, type CameraHandle } from '../../lib/camera';

export interface PermissionGateOpts {
  onGranted: (handle: CameraHandle) => void;
  onDenied: () => void;
  denied?: boolean;
}

export function PermissionGate({ onGranted, onDenied, denied }: PermissionGateOpts): HTMLElement {
  const root = el('div', { class: 'flex flex-col items-center justify-center h-full px-6 text-center gap-6 font-thai bg-choojai-bg' });

  async function request() {
    try {
      const handle = await startSelfieCamera();
      onGranted(handle);
    } catch {
      onDenied();
    }
  }

  if (denied) {
    root.append(
      el('h2', { class: 'text-2xl font-bold text-choojai-green-dark' }, ['ต้องเปิดกล้องก่อน']),
      el('p', { class: 'text-base text-choojai-green-dark/80 max-w-xs' }, ['เกมนี้ใช้กล้องตรวจจับการจีบนิ้ว — กล้องไม่ส่งออกที่ไหน 100% บนเครื่อง']),
      Button({ label: 'ลองใหม่', onClick: request })
    );
  } else {
    root.append(
      el('div', { class: 'text-6xl' }, ['📷']),
      el('h2', { class: 'text-2xl font-bold text-choojai-green-dark' }, ['ขอเปิดกล้อง selfie']),
      el('p', { class: 'text-base text-choojai-green-dark/80 max-w-xs' }, ['ใช้ตรวจจับการจีบนิ้ว — กล้องไม่ส่งออกที่ไหน 100% อยู่บนเครื่องคุณ']),
      Button({ label: 'อนุญาต', onClick: request })
    );
  }

  return root;
}
