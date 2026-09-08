import {cn, formatDateToShort, splitDisplayName} from "@/lib/utils";
import {User} from "@/types/user";

interface UserDataProps {
    user: User | null;
    className?: string;
}

export function UserData ({user, className}: UserDataProps) {

    const {lastName, firstName} = splitDisplayName(user?.displayName)

    const profileFields = [
        { label: "Фамилия", value: lastName ?? 'не указано'  },
        { label: "Имя", value: firstName ?? 'не указано'  },
        { label: "Дата рождения", value: formatDateToShort(user?.birthday) ?? 'не указано'  },
        { label: "Электронная почта", value: user?.email ?? 'не указано'  },
        { label: "Номер телефона", value: user?.number ?? 'не указано'},
    ]
    return (
        <div className={cn("grid grid-cols-1 sm:grid-cols-3 gap-x-12 gap-y-6", className)}>
            {profileFields.map((field, index) => (
                <div key={index} className="flex flex-col gap-1.5">
                    <span className="text-sm font-medium text-[#9E9E9E]">{field.label}</span>
                    <span className="text-base font-normal text-white">{field.value}</span>
                </div>
            ))}
        </div>
    )
}