import type { InputDevice } from '../../types/clinical'
import { Eyebrow } from '../ui/Eyebrow'
import { Panel } from '../ui/Panel'

interface InputStatusPanelProps {
  devices: InputDevice[]
}

/**
 * Where the data is coming from.
 *
 * This is connection health, which is a different thing from the model's
 * data-sufficiency measure — a device can be streaming perfectly while most of the
 * parameters it does not carry are still population defaults. The two are kept apart
 * deliberately.
 */
export function InputStatusPanel({ devices }: InputStatusPanelProps) {
  return (
    <Panel className="p-4">
      <Eyebrow trailing={`${devices.length} sources`}>Input status</Eyebrow>

      <ul className="mt-1">
        {devices.map((device) => (
          <li
            key={device.device_id}
            className="flex items-start justify-between gap-3 border-t border-rule-faint py-2.5 first:border-t-0"
          >
            <div className="min-w-0">
              <p className="text-2xs text-ink-950">{device.label}</p>
              <p className="font-mono text-[10px] text-ink-400">
                {device.device_make_model} · {device.device_id}
              </p>
            </div>
            <div className="shrink-0 text-right">
              <p className="text-2xs text-ink-700">{device.state}</p>
              <p className="font-mono text-[10px] tabular-nums text-ink-400">{device.detail}</p>
            </div>
          </li>
        ))}
      </ul>

      <p className="mt-2 border-t border-rule-faint pt-2.5 text-[10px] leading-relaxed text-ink-400">
        Read-only. PulseMind receives from these sources and sends nothing to them.
      </p>
    </Panel>
  )
}
