import { FormEvent, useState, useEffect, useRef } from 'react';
import clsx from 'clsx';

import { ArrowButton } from 'src/ui/arrow-button';
import { Button } from 'src/ui/button';
import { Select } from 'src/ui/select';
import { RadioGroup } from 'src/ui/radio-group';
import { Separator } from 'src/ui/separator';
import {
	ArticleStateType,
	fontFamilyOptions,
	fontColors,
	fontSizeOptions,
	backgroundColors,
	defaultArticleState,
	contentWidthArr,
	OptionType,
} from 'src/constants/articleProps';

import styles from './ArticleParamsForm.module.scss';

type ArticleParamsFormProps = {
	onApply: (state: ArticleStateType) => void;
};

export const ArticleParamsForm = ({ onApply }: ArticleParamsFormProps) => {
	const [isOpen, setIsOpen] = useState(false);
	const [formState, setFormState] =
		useState<ArticleStateType>(defaultArticleState);
	const sidebarRef = useRef<HTMLDivElement>(null);

	const updateField = (field: keyof ArticleStateType, value: OptionType) => {
		setFormState((prev) => ({ ...prev, [field]: value }));
	};

	const handleReset = (e: FormEvent) => {
		e.preventDefault();
		setFormState(defaultArticleState);
		onApply(defaultArticleState);
	};

	const handleSubmit = (e: FormEvent) => {
		e.preventDefault();
		onApply(formState);
	};

	useEffect(() => {
		if (!isOpen) return;

		const handleClickOutside = (e: MouseEvent) => {
			const sidebar = sidebarRef.current;
			if (sidebar && !sidebar.contains(e.target as Node)) {
				setIsOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, [isOpen]);

	return (
		<div ref={sidebarRef}>
			<ArrowButton isOpen={isOpen} onClick={() => setIsOpen((prev) => !prev)} />
			<aside
				className={clsx(styles.container, { [styles.container_open]: isOpen })}>
				<form
					className={styles.form}
					onReset={handleReset}
					onSubmit={handleSubmit}>
					<h2 className={styles.title}>Задайте параметры</h2>
					<Select
						title='ШРИФТ'
						selected={formState.fontFamilyOption}
						options={fontFamilyOptions}
						onChange={(value) => updateField('fontFamilyOption', value)}
					/>
					<RadioGroup
						title='РАЗМЕР ШРИФТА'
						name='fontSize'
						selected={formState.fontSizeOption}
						options={fontSizeOptions}
						onChange={(value) => updateField('fontSizeOption', value)}
					/>
					<Select
						title='ЦВЕТ ШРИФТА'
						selected={formState.fontColor}
						options={fontColors}
						onChange={(value) => updateField('fontColor', value)}
					/>
					<Separator />
					<Select
						title='ЦВЕТ ФОНА'
						selected={formState.backgroundColor}
						options={backgroundColors}
						onChange={(value) => updateField('backgroundColor', value)}
					/>
					<Select
						title='ШИРИНА КОНТЕНТА'
						selected={formState.contentWidth}
						options={contentWidthArr}
						onChange={(value) => updateField('contentWidth', value)}
					/>

					<div className={styles.bottomContainer}>
						<Button title='Сбросить' htmlType='reset' type='clear' />
						<Button title='Применить' htmlType='submit' type='apply' />
					</div>
				</form>
			</aside>
		</div>
	);
};
