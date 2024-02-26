// import { UseFormReturn } from "react-hook-form";
import {
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";

export default function FormElement({
	fieldName,
	placeHoldText,
	form,
}: {
	fieldName: string;
	placeHoldText: string;
	form: any;
}) {
	return (
		<FormField
			control={form.control}
			name={fieldName}
			render={({ field }) => (
				<FormItem className="text-dark100_light900">
					<FormLabel className="text-dark500_light700 tracking-wider capitalize">
						{fieldName}
					</FormLabel>
					<FormControl>
						<Input
							className=" text-dark400_light500 tracking-wide small-medium no-focus placeholder:text-light400_dark500"
							placeholder={placeHoldText}
							{...field}
						/>
					</FormControl>
					<FormMessage className="text-red-600 dark:text-red-600" />
				</FormItem>
			)}
		/>
	);
}
