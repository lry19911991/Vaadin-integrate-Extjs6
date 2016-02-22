package com.polelink.pike.box.widgetset.client;

import com.google.gwt.core.client.Callback;
import com.google.gwt.core.client.EntryPoint;
import com.google.gwt.core.client.ScriptInjector;
import com.google.gwt.user.client.Window;

public class PikeWidgetSet implements EntryPoint {
	public void onModuleLoad() {
		ScriptInjector.fromUrl("./VAADIN/js/ext-all.js")
				.setWindow(ScriptInjector.TOP_WINDOW)
				.setCallback(new Callback<Void, Exception>() {
					public void onFailure(Exception reason) {
						Window.alert("Script load failed.");
					}

					public void onSuccess(Void result) {
						//Window.alert("Script ext-all load success.");
						ScriptInjector.fromUrl("./VAADIN/js/theme-triton.js")
								.setWindow(ScriptInjector.TOP_WINDOW)
								.setCallback(new Callback<Void, Exception>() {
									public void onFailure(Exception reason) {
										Window.alert("Script load failed.");
									}

									public void onSuccess(Void result) {
									//	Window.alert("Script theme-triton load success.");
										ScriptInjector
												.fromUrl(
														"./VAADIN/js/gnt-all-debug.js")
												.setWindow(
														ScriptInjector.TOP_WINDOW)
												.setCallback(
														new Callback<Void, Exception>() {
															public void onFailure(
																	Exception reason) {
																Window.alert("Script gnt-all-debug load failed.");
															}

															public void onSuccess(
																	Void result) {
																
																
															//	Window.alert("Script gnt-all-debug load success.");
//																ScriptInjector
//																		.fromUrl(
//																				"./VAADIN/js/app.js")
//																		.setWindow(
//																				ScriptInjector.TOP_WINDOW)
//																		.setCallback(
//																				new Callback<Void, Exception>() {
//																					public void onFailure(
//																							Exception reason) {
//																						Window.alert("Script app.js load failed.");
//																					}
//
//																					public void onSuccess(
//																							Void result) {
//																						Window.alert("Script app.js load success.");
//																					}
//																				})
//																		.inject();

															}
														}).inject();
									}
								}).inject();

					}
				}).inject();

	}
}