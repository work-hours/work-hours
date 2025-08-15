import * as React from 'react';
import { Input } from '@/components/ui/input';
import { UsersIcon } from 'lucide-react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

interface SearchableSelectProps {
    value: string,
    onChange: (value: string) => void,
    options: { id: number | string; name: string }[],
    placeholder?: string,
    disabled?: boolean,
    className?: string,
    icon?: React.ReactNode,
    id?: string
}

export function SearchableSelect({
                                     value,
                                     onChange,
                                     options,
                                     placeholder = 'Select an option',
                                     disabled = false,
                                     className,
                                     icon = <UsersIcon className="h-4 w-4 text-muted-foreground" />
                                 }: SearchableSelectProps) {
    const [open, setOpen] = React.useState(false);
    const [searchTerm, setSearchTerm] = React.useState('');

    const filteredOptions = React.useMemo(() => {
        if (!searchTerm) return options;
        return options.filter((option) =>
            option.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
    }, [options, searchTerm]);

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(e.target.value);
    };

    const handleSelectChange = (selectedValue: string) => {

        onChange(selectedValue === "all" ? "" : selectedValue);
        setOpen(false);
        setSearchTerm('');
    };

    const selectedOption = options.find(
        (option) => option.id.toString() === value || (option.id.toString() === "" && value === "")
    );

    return (
        <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                {icon}
            </div>
            <Select
                open={open}
                onOpenChange={setOpen}
                value={value === "" ? "all" : value}
                onValueChange={handleSelectChange}
                disabled={disabled}
            >
                <SelectTrigger className={cn('pl-10 h-10', className)}>
                    <SelectValue placeholder={placeholder}>
                        {selectedOption ? selectedOption.name : placeholder}
                    </SelectValue>
                </SelectTrigger>
                <SelectContent>
                    <div className="px-1 py-2">
                        <Input
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="mb-2"
                            onClick={(e) => e.stopPropagation()}
                            autoFocus
                        />
                        {filteredOptions.length > 0 ? (
                            filteredOptions.map((option) => (
                                <SelectItem key={option.id} value={option.id.toString() || "all"}>
                                    {option.name}
                                </SelectItem>
                            ))
                        ) : (
                            <div className="px-2 py-1.5 text-sm text-muted-foreground">
                                No results found
                            </div>
                        )}
                    </div>
                </SelectContent>
            </Select>
        </div>
    );
}
