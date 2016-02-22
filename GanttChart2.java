package com.polelink.pike.extend.component.gantt;

import com.polelink.pike.core.event.DownLoadResourceEvent;
import com.polelink.pike.core.event.EventUtil;
import com.vaadin.annotations.JavaScript;
import com.vaadin.annotations.StyleSheet;
import com.vaadin.ui.AbstractJavaScriptComponent;
import com.vaadin.ui.JavaScriptFunction;

import elemental.json.JsonArray;

@JavaScript({ "app.js"})
public class GanttChart2 extends AbstractJavaScriptComponent {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	private static final String GANNT_TASK_CONTEXT_MENU_FUNCTION = "GANNT_TASK_CONTEXT_MENU_FUNCTION";
	private static final String GANNT_PNG_RESOURCE_DOWNLOAD = "GANNT_PNG_RESOURCE_DOWNLOAD";
	private static final String exportGanttImageName = "Gantt.png";
	public GanttChart2() {

		this.setId("TestExtjs");
		com.vaadin.ui.JavaScript.getCurrent().addFunction(
				GANNT_PNG_RESOURCE_DOWNLOAD, new JavaScriptFunction() {

					/**
					 * 
					 */
					private static final long serialVersionUID = -4218266823885018541L;

					@Override
					public void call(JsonArray arguments) {
						final String resourceDirectory = arguments.getString(0);
						EventUtil
						.post(new DownLoadResourceEvent(
								resourceDirectory,
								exportGanttImageName,
								true));

					}
				});

	}
	
	@Override
	public void attach() {
		// TODO Auto-generated method stub
		super.attach();
          this.setPrimaryStyleName("my");
	}
	
}
