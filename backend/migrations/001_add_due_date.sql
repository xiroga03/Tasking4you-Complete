-- Tasking4You migration 001: add optional task due dates.
-- Safe to run more than once; existing tasks remain unchanged.

ALTER TABLE public.tasks
  ADD COLUMN IF NOT EXISTS due_date DATE;

CREATE INDEX IF NOT EXISTS idx_tasks_due_date
  ON public.tasks (due_date);
