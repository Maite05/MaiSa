"use client";

import { Button, color, font, Modal, space, tableIconButtonStyle, typography } from "@maisa/ui";
import { EventScopedPageHeader } from "@/components/EventScopedPageHeader";
import { useTasksActions } from "../actions";
import { TaskForm } from "../components/TaskForm";
import { useDeleteTask, useTasks, useUpdateTask } from "../hooks";
import { getTaskStatusLabel, groupTasksByStatus } from "../services";
import { useTasksUiStore } from "../store";
import type { Task, TaskStatus } from "../types";
import { isOverdue } from "../validators";

const COLUMNS: TaskStatus[] = ["TODO", "IN_PROGRESS", "DONE"];

function TaskCard({ eventId, task, onEdit }: { eventId: string; task: Task; onEdit: () => void }) {
  const updateTask = useUpdateTask(eventId, task.id);
  const deleteTask = useDeleteTask(eventId);

  return (
    <div
      style={{
        background: color.surfaceContainerLowest,
        border: `1px solid ${color.borderSubtle}`,
        borderRadius: "0.375rem",
        padding: space(1.5),
        marginBottom: space(1.5),
      }}
    >
      <p style={{ margin: 0, fontSize: "14px", fontWeight: 600 }}>{task.title}</p>
      {task.dueDate && (
        <p style={{ margin: `${space(0.5)} 0 0`, fontSize: "12px", color: isOverdue(task) ? color.error : color.onSurfaceVariant }}>
          Due {new Date(task.dueDate).toLocaleDateString()}
        </p>
      )}
      <div style={{ display: "flex", gap: space(1), marginTop: space(1) }}>
        <select
          aria-label="Change status"
          value={task.status}
          onChange={(e) => updateTask.mutate({ status: e.target.value as TaskStatus })}
          style={{ fontSize: "12px", padding: "2px 4px", border: `1px solid ${color.borderSubtle}`, borderRadius: "0.125rem" }}
        >
          {COLUMNS.map((s) => (
            <option key={s} value={s}>
              {getTaskStatusLabel(s)}
            </option>
          ))}
        </select>
        <button style={tableIconButtonStyle} onClick={onEdit}>
          Edit
        </button>
        <button
          style={tableIconButtonStyle}
          onClick={() => {
            if (window.confirm(`Delete "${task.title}"?`)) deleteTask.mutate(task.id);
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
}

export function TasksBoardPage({ eventId }: { eventId: string }) {
  const modal = useTasksUiStore((s) => s.modal);
  const { openCreate, openEdit, closeModal } = useTasksActions();
  const { data, isLoading } = useTasks(eventId, { limit: 200 });

  const tasks = data?.data ?? [];
  const editingTask = modal.mode === "edit" ? tasks.find((t) => t.id === modal.taskId) : undefined;
  const grouped = groupTasksByStatus(tasks);

  return (
    <div style={{ background: color.background, color: color.onSurface, fontFamily: font.sans, minHeight: "100%" }}>
      <EventScopedPageHeader eventId={eventId} title="Tasks" />

      <main style={{ maxWidth: 1280, margin: "0 auto", padding: `0 ${space(8)} ${space(15)}` }}>
        <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: space(2) }}>
          <Button onClick={openCreate}>+ Add Task</Button>
        </div>

        {isLoading ? (
          <p style={{ color: color.onSurfaceVariant }}>Loading…</p>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: space(2) }}>
            {COLUMNS.map((status) => (
              <div key={status} style={{ background: color.surfaceContainerHigh, borderRadius: "0.375rem", padding: space(1.5) }}>
                <p style={{ ...typography.labelCaps, marginBottom: space(1.5) }}>
                  {getTaskStatusLabel(status)} ({grouped[status].length})
                </p>
                {grouped[status].length === 0 ? (
                  <p style={{ fontSize: "13px", color: color.onSurfaceVariant }}>No tasks</p>
                ) : (
                  grouped[status].map((task) => (
                    <TaskCard key={task.id} eventId={eventId} task={task} onEdit={() => openEdit(task.id)} />
                  ))
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      <Modal open={modal.mode !== "closed"} onClose={closeModal} title={modal.mode === "edit" ? "Edit Task" : "Add Task"}>
        <TaskForm eventId={eventId} task={editingTask} onDone={closeModal} />
      </Modal>
    </div>
  );
}

export default TasksBoardPage;
