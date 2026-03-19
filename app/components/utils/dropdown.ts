export interface DropdownOption {
  value: number | string
  label: string
}

export function mapToOptions(data: any[]): DropdownOption[] {
  return data.map((item) => {
    const labelKey = Object.keys(item).find((k) => k !== "id")

    return {
      value: item.id,
      label: labelKey ? String(item[labelKey]) : String(item.id),
    }
  })
}