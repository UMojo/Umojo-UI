winkstart.module('call_center', 'dashboard', {
        css: [
            'css/dashboard.css'
        ],

        templates: {
            dashboard: 'tmpl/dashboard.html',
            agents_dashboard: 'tmpl/agents_dashboard.html',
            call: 'tmpl/call_list_element.html'
        },

        subscribe: {
            'dashboard.activate': 'activate',
            'dashboard.activate_queue_stat': 'activate_queue_stat'
        },

        resources: {
            'dashboard.queues.stats': {
                url: '{api_url}/accounts/{account_id}/queues/stats',
                contentType: 'application/json',
                verb: 'GET'
            },
            'dashboard.agents.stats': {
                url: '{api_url}/accounts/{account_id}/agents/stats',
                contentType: 'application/json',
                verb: 'GET'
            },
            'dashboard.agents.livestats': {
                url: '{api_url}/accounts/{account_id}/agents/stats/realtime',
                contentType: 'application/json',
                verb: 'GET',
                trigger_events: false
            },
            'dashboard.queues.livestats': {
                url: '{api_url}/accounts/{account_id}/queues/stats/realtime',
                contentType: 'application/json',
                verb: 'GET',
                trigger_events: false
            },
            'dashboard.agents.livestats_loading': {
                url: '{api_url}/accounts/{account_id}/agents/stats/realtime',
                contentType: 'application/json',
                verb: 'GET'
            },
            'dashboard.queues.livestats_loading': {
                url: '{api_url}/accounts/{account_id}/queues/stats/realtime',
                contentType: 'application/json',
                verb: 'GET'
            },
            'dashboard.queues.list': {
                url: '{api_url}/accounts/{account_id}/queues',
                contentType: 'application/json',
                verb: 'GET'
            },
            'dashboard.queues.get': {
                url: '{api_url}/accounts/{account_id}/queues/{queue_id}',
                contentType: 'application/json',
                verb: 'GET'
            },
            'dashboard.agents.get': {
                url: '{api_url}/accounts/{account_id}/agents',
                contentType: 'application/json',
                verb: 'GET'
            }
        }
    },

    function(args) {
        var THIS = this;

        winkstart.registerResources(THIS.__whapp, THIS.config.resources);

        winkstart.publish('whappnav.subnav.add', {
            whapp: 'call_center',
            module: THIS.__module,
            label: 'Dashboard',
            icon: 'graph1_box',
            weight: '20'
        });
    },

    {
        //huge_timer: false,
        global_timer: false,
        map_timers: {
            users: {},
            breaks: {},
            calls: {}
        },

        poll_agents: function(global_data, _parent) {
            var THIS = this,
                parent = _parent,
                polling_interval = 2,
                map_agents = {},
                /*poll = function() {
                    var data_template = $.extend(true, {}, global_data.template); //copy without reference;
                    if($('#dashboard-content').size() === 0) {
                        clearInterval(THIS.global_timer);
                        THIS.global_timer = false;
                    }
                    else {
                        THIS.get_queues_livestats(false, function(_data_queues) {
                            $.each(_data_queues.data.current_calls, function(queue_id, queue_calls) {
                                $.each(queue_calls, function(call_id, call) {
                                    if(!(call_id.toLowerCase() in THIS.map_timers.calls)) {
                                        THIS.add_callwaiting(call);
                                    }
                                });
                            });

                            $.each(THIS.map_timers.calls, function(k, v) {
                                var to_remove = true;
                                $.each(_data_queues.data.current_calls, function(queue_id, queue_calls) {
                                    if((k in queue_calls)) {
                                        to_remove = false;
                                    }
                                });

                                if(to_remove === true) {
                                    THIS.remove_callwaiting(k);
                                }
                            });
                        });

                        THIS.get_agents_livestats(false, function(_data_agents) {
                            console.log(global_data);
                            console.log(_data_agents);

                            $.each(global_data.template.agents, function(k, v) {
                                //v.status = _data_agents.data.current_statuses[k] || 'off';
                                data_template.agents[k].status = _data_agents.data.current_statuses[k] || 'off'

                                if(k in _data_agents.data.current_stats && _data_agents.data.current_stats[k].calls_handled) {
                                    $.each(_data_agents.data.current_stats[k].calls_handled, function(k2, v2) {
                                        data_template.agents[k].call_per_hour++;
                                        data_template.agents[k].call_per_day++;

                                        data_template.agents[k].queues_list[v2.queue_id].call_per_hour++;
                                        data_template.agents[k].queues_list[v2.queue_id].call_per_day++;
                                    });
                                }

                                data_template.agents[k].call_time = THIS.get_time_seconds(k in _data_agents.data.current_calls ? (_data_agents.data.current_calls[k].duration) : 0);
                            });

                            console.log(data_template);

                            //If queue is selected
                            $('#ws-content #dashboard-view').empty()
                                            .append(THIS.templates.agents_dashboard.tmpl(data_template));

                            /*if(_data_agents.data.current_statuses) {
                                $.each(_data_agents.data.current_statuses, function(k, v) {
                                    //update current status
                                    if(!map_agents[k]) {
                                        map_agents[k] = v;
                                    }
                                    else if(map_agents[k] !== v) {
                                        $('.agent_wrapper#'+k, parent).removeClass('answered ringing ready paused off')
                                                                      .addClass(v);
                                        map_agents[k] = v;

                                        if(v === 'paused') {
                                            $('.agent_wrapper#'+k+' .call_time .data_title', parent).html('Break Time');
                                            THIS.start_timer($('.agent_wrapper#'+k+' .call_time .data_value', parent), 0, k, 'break');
                                        }
                                    }
                                });
                            }

                            if(_data_agents.data.current_calls) {
                                $.each(_data_agents.data.current_calls, function(k, v) {
                                    // If it's a new call, then we update the page and update the timer.
                                    if(!(k in THIS.map_timers.users)) {
                                        if(v.agent_state === 'answered') {
                                            $('.agent_wrapper#'+k, parent).removeClass('ready ringing paused off')
                                                                          .addClass('answered');

                                            THIS.start_timer($('.agent_wrapper#'+k+' .call_time .data_value', parent), v.duration, k);
                                        }
                                    }
                                });
                            }

                            $.each(map_agents, function(k, v) {
                                var $agent_wrapper = $('.agent_wrapper#'+k, parent);

                                if(k in THIS.map_timers.breaks && v !== 'paused') {
                                    $('.call_time .data_value', $agent_wrapper).html('-');
                                    $('.call_time .data_title', $agent_wrapper).html('Call Time');

                                    clearInterval(THIS.map_timers.breaks[k]);
                                    delete THIS.map_timers.breaks[k];
                                }

                                //If an agent is no longer calling, we remove the timer and update the page
                                if(!(k in _data_agents.data.current_calls) && THIS.map_timers.users[k]) {

                                    $agent_wrapper.removeClass('answered ready ringing paused off')
                                                  .addClass(v);

                                    $('.call_time .data_value', $agent_wrapper).html('-');

                                    //TODO Update call hours with last hour stat.
                                    var call_day = parseFloat($('.call_day .data_value', $agent_wrapper).html()),
                                        call_hours  = parseFloat($('.call_hours .data_value', $agent_wrapper).html());

                                    $('.all_data .call_hours .data_value', $agent_wrapper).html(++call_hours);
                                    $('.all_data .call_day .data_value', $agent_wrapper).html(++call_day);

                                    clearInterval(THIS.map_timers.users[k]);
                                    delete THIS.map_timers.users[k];
                                }

                                //If an agent logs off the queue, he's no longer in the current statuses
                                if(v !== 'off' && !(k in _data_agents.data.current_statuses)) {
                                    $('.agent_wrapper#'+k, parent).removeClass('answered ready ringing paused')
                                                                  .addClass('off');
                                    map_agents[k] = 'off';
                                }
                            });
                        });
                    }
                },*/
                poll = function() {
                    if($('#dashboard-content').size() === 0) {
                        clearInterval(THIS.global_timer);
                        THIS.global_timer = false;
                    }
                    else {
                        THIS.get_queues_livestats(false, function(_data_queues) {
                            $.each(_data_queues.data.current_calls, function(queue_id, queue_calls) {
                                $.each(queue_calls, function(call_id, call) {
                                    if(!(call_id.toLowerCase() in THIS.map_timers.calls)) {
                                        THIS.add_callwaiting(call);
                                    }
                                });
                            });

                            $.each(THIS.map_timers.calls, function(k, v) {
                                var to_remove = true;
                                $.each(_data_queues.data.current_calls, function(queue_id, queue_calls) {
                                    if((k in queue_calls)) {
                                        to_remove = false;
                                    }
                                });

                                if(to_remove === true) {
                                    THIS.remove_callwaiting(k);
                                }
                            });
                        });

                        THIS.get_agents_livestats(false, function(_data_agents) {
                            if(_data_agents.data.current_statuses) {
                                $.each(_data_agents.data.current_statuses, function(k, v) {
                                    if(!map_agents[k]) {
                                        map_agents[k] = v;
                                    }
                                    else if(map_agents[k] !== v) {
                                        $('.agent_wrapper#'+k, parent).removeClass('answered ringing ready paused off')
                                                                      .addClass(v);
                                        map_agents[k] = v;

                                        if(v === 'paused') {
                                            $('.agent_wrapper#'+k+' .call_time .data_title', parent).html('Break Time');
                                            THIS.start_timer($('.agent_wrapper#'+k+' .call_time .data_value', parent), 0, k, 'break');
                                        }
                                    }
                                });
                            }

                            if(_data_agents.data.current_calls) {
                                $.each(_data_agents.data.current_calls, function(k, v) {
                                    // If it's a new call, then we update the page and update the timer.
                                    if(!(k in THIS.map_timers.users)) {
                                        if(v.agent_state === 'answered') {
                                            $('.agent_wrapper#'+k, parent).removeClass('ready ringing paused off')
                                                                          .addClass('answered');

                                            THIS.start_timer($('.agent_wrapper#'+k+' .call_time .data_value', parent), v.duration, k);
                                        }
                                    }
                                });
                            }

                            $.each(map_agents, function(k, v) {
                                var $agent_wrapper = $('.agent_wrapper#'+k, parent);

                                if(k in THIS.map_timers.breaks && v !== 'paused') {
                                    $('.call_time .data_value', $agent_wrapper).html('-');
                                    $('.call_time .data_title', $agent_wrapper).html('Call Time');

                                    clearInterval(THIS.map_timers.breaks[k]);
                                    delete THIS.map_timers.breaks[k];
                                }

                                //If an agent is no longer calling, we remove the timer and update the page
                                if(!(k in _data_agents.data.current_calls) && THIS.map_timers.users[k]) {

                                    $agent_wrapper.removeClass('answered ready ringing paused off')
                                                  .addClass(v);

                                    $('.call_time .data_value', $agent_wrapper).html('-');

                                    //TODO Update call hours with last hour stat.
                                    var call_day = parseFloat($('.call_day .data_value', $agent_wrapper).html()),
                                        call_hours  = parseFloat($('.call_hours .data_value', $agent_wrapper).html());

                                    $('.all_data .call_hours .data_value', $agent_wrapper).html(++call_hours);
                                    $('.all_data .call_day .data_value', $agent_wrapper).html(++call_day);

                                    clearInterval(THIS.map_timers.users[k]);
                                    delete THIS.map_timers.users[k];
                                }

                                //If an agent logs off the queue, he's no longer in the current statuses
                                if(v !== 'off' && !(k in _data_agents.data.current_statuses)) {
                                    $('.agent_wrapper#'+k, parent).removeClass('answered ready ringing paused')
                                                                  .addClass('off');
                                    map_agents[k] = 'off';
                                }
                            });
                        });
                    }
                };
                /*huge_poll: function() {
                    if(THIS.global_timer) {
                        clearInterval(THIS.global_timer);
                        THIS.global_timer = false;
                    }

                    //fetch all data
                    THIS.get_data(function(_data_template) {
                        data_template = _data_template.data;

                        THIS.global_timer = setInterval(poll, polling_interval * 1000);
                    });
                };*/

            $.each(global_data.agents, function(k, v) {
                map_agents[v.id] = 'off';
            });

            THIS.global_timer = setInterval(poll, polling_interval * 1000);

            //THIS.huge_timer = setInterval(huge_poll, polling_interval * 1000 * 60);
        },

        /* display_loading is here in order to show the please wait screen or not,
           as we don't want to display it while polling, but we do want to display it for the first request */
        get_queues_livestats: function(display_loading, success, error) {
            var request_string = display_loading ? 'dashboard.queues.livestats_loading' : 'dashboard.queues.livestats';

            winkstart.request(request_string, {
                    account_id: winkstart.apps['call_center'].account_id,
                    api_url: winkstart.apps['call_center'].api_url
                },
                function(_data, status) {
                    if(typeof success == 'function') {
                        success(_data, status);
                    }
                },
                function(_data, status) {
                    if(typeof error == 'function') {
                        error(_data, status);
                    }
                }
            );
        },

        /* display_loading is here in order to show the please wait screen or not
           as we don't want to display it while polling, but we do want to display it for the first request */
        get_agents_livestats: function(display_loading, success, error) {
            var request_string = display_loading ? 'dashboard.agents.livestats_loading' : 'dashboard.agents.livestats';

            winkstart.request(request_string, {
                    account_id: winkstart.apps['call_center'].account_id,
                    api_url: winkstart.apps['call_center'].api_url
                },
                function(_data, status) {
                    if(typeof success == 'function') {
                        success(_data, status);
                    }
                },
                function(_data, status) {
                    if(typeof error == 'function') {
                        error(_data, status);
                    }
                }
            );
        },

        get_agents_stats: function(success, error) {
            winkstart.request('dashboard.agents.stats', {
                    account_id: winkstart.apps['call_center'].account_id,
                    api_url: winkstart.apps['call_center'].api_url
                },
                function(_data, status) {
                    if(typeof success == 'function') {
                        success(_data, status);
                    }
                },
                function(_data, status) {
                    if(typeof error == 'function') {
                        error(_data, status);
                    }
                }
            );
        },

        get_queues_stats: function(success, error) {
            winkstart.request('dashboard.queues.stats', {
                    account_id: winkstart.apps['call_center'].account_id,
                    api_url: winkstart.apps['call_center'].api_url
                },
                function(_data, status) {
                    if(typeof success == 'function') {
                        success(_data, status);
                    }
                },
                function(_data, status) {
                    if(typeof error == 'function') {
                        error(_data, status);
                    }
                }
            );
        },

        render_callwaiting_list: function(_parent){
            var THIS = this,
                parent = _parent || $('#dashboard-content');;

            var array_cw = [
            /*    { id: 'bl0', title: '415-202-4335', wait_time: 32, queue_id: 'queue_1' },
                { id: 'bl19', title: '415-256-3929', wait_time: 547, queue_id: 'queue_1' }*/
            ];

            array_cw.sort(function(a, b) {
                return a.wait_time < b.wait_time ? -1 : 1;
            });

            $('#callwaiting-list', parent)
                .empty()
                .listpanel({
                    label: 'Call Waiting',
                    identifier: 'callwaiting-listview',
                    data: array_cw
                });

            $('.add_flow', parent).empty()
                                  .html('Call Waiting Log...');

            $.each(array_cw, function(k, v) {
                $('#'+v.id).append('<span class="timer" data-seconds="'+ v.wait_time +'"></span>')
                           .dataset('queue_id', v.queue_id);
            });
        },

        add_callwaiting: function(call) {
            var THIS = this;

            call.friendly_duration = THIS.get_time_seconds(call.wait_time);
            var call_html = THIS.templates.call.tmpl(call);
            $('#callwaiting-list .list-panel-anchor ul').append(call_html);

            THIS.map_timers.calls[call.call_id.toLowerCase()] = setInterval(function(){$('.timer', call_html).html(THIS.get_time_seconds(++call.wait_time));}, 1000);
        },

        remove_callwaiting: function(call_id) {
            var THIS = this;

            $('#callwaiting-list .list-panel-anchor ul li').each(function(k, v) {
                if($(v).attr('id').toLowerCase() === call_id) {
                    $(v).remove().hide();
                }
            });

            clearInterval(THIS.map_timers.calls[call_id]);
            delete THIS.map_timers.calls[call_id.toLowerCase()];
        },

        /*move_gauge: function(active_calls, total_calls, _parent) {
            var THIS = this,
                parent = _parent;

            var rotate_deg = 'rotate('+(active_calls / total_calls) * 180+'deg)';
            $('#gauge_total_calls .min_calls', parent).html(active_calls);
            $('#gauge_total_calls .max_calls', parent).html(total_calls);
            $('#gauge_total_calls .top_part', parent).css({'-moz-transform': rotate_deg, '-webkit-transform': rotate_deg});
        },*/

        get_time_seconds: function(seconds) {
            var hours = Math.floor(seconds / 3600),
                minutes = Math.floor(seconds / 60) % 60,
                remaining_seconds = seconds % 60,
                display_time = (hours < 10 ? '0' + hours : '' + hours) + ':' + (minutes < 10 ? '0' + minutes : '' + minutes) + ':' + (remaining_seconds < 10 ? '0' + remaining_seconds : '' + remaining_seconds);

            return seconds === 0 ? '00:00:00' : display_time;
        },

        start_timer: function(target, seconds, id, state) {
            var THIS = this,
                render_timer = function(target, seconds) {
                    if(!(target.hasClass('off'))) {
                        target.html(THIS.get_time_seconds(seconds));
                    }
                };

            if(target.size() > 0) {
                render_timer(target, seconds);

                if(id) {
                    if(state === 'break') {
                        THIS.map_timers.breaks[id] = setInterval(function(){render_timer(target, ++seconds);}, 1000);
                    }
                    else {
                        THIS.map_timers.users[id] = setInterval(function(){render_timer(target, ++seconds);}, 1000);
                    }
                }
                else {
                    setInterval(function(){render_timer(target, ++seconds);}, 1000)
                }
            }
        },

        //TODO
        format_data: function(_data) {
            var THIS = this,
                data = _data,
                map_sort_status = {
                    'ready': 1,
                    'answered': 2,
                    'paused': 3,
                    'off': 4
                },
                total_calls = 0,
                active_calls = 0,
                map_agents_stats = THIS.format_agents_stats(_data),
                map_queues_stats = THIS.format_queues_stats(_data),
                get_queue_stat = function(queue_id) {
                    if(!(queue_id in map_queues_stats)) {
                        console.log('queue doesnt exist yet');
                        map_queues_stats[queue_id] = {
                            current_calls: 0,
                            max_calls: 0,
                            current_agents: 0,
                            max_agents: 0,
                            dropped_calls: 0,
                            average_hold_time: 0
                        };
                    }

                    return map_queues_stats[queue_id];
                },
                get_agent_stat = function(agent_id) {
                    if(!(agent_id in map_agents_stats)) {
                        console.log('agent doesnt exist yet');
                        map_agents_stats[agent_id] = {
                            status: 'off',
                            call_time: 0,
                            break_time: 0,
                            call_per_hour: 0,
                            call_per_day: 0,
                            calls_missed: 0,
                            queues_list: {}
                        };
                    }

                    return map_agents_stats[agent_id];
                },
                map_current_stat = {};

            if(data.agents_live_stats.data.current_statuses) {
                $.each(data.agents_live_stats.data.current_statuses, function(agent_id, agent_status) {
                    map_current_stat[agent_id] = { agent_status: agent_status };
                });
            }

            if(data.agents_live_stats.data.current_stats) {
                $.each(data.agents_live_stats.data.current_stats, function(agent_id, calls) {
                    if(calls.calls_handled) {
                        map_current_stat[agent_id] = map_current_stat[agent_id] || {};
                        map_current_stat[agent_id].new_calls = 0;
                        map_current_stat[agent_id].queues_list = {};

                        $.each(calls.calls_handled, function(k, v) {
                            if(!(v.queue_id in map_current_stat[agent_id].queues_list)) {
                                map_current_stat[agent_id].queues_list[v.queue_id] = {
                                    new_calls: 0,
                                };
                            }

                            map_current_stat[agent_id].new_calls++;
                            map_current_stat[agent_id].queues_list[v.queue_id].new_calls++;
                        });
                    }
                });
            }

            $.each(data.agents, function(k, v) {
                var queue_string = '';
                $.extend(true, v, get_agent_stat(v.id));

                if(v.id in map_current_stat) {
                    v.call_per_day += map_current_stat[v.id].new_calls || 0;
                    v.call_per_hour += map_current_stat[v.id].new_calls || 0;
                    v.status = map_current_stat[v.id].agent_status || 'off';
                }

                $.each(v.queues, function(k2, v2) {
                    if(!(v2 in map_queues_stats)) {
                        $.extend(true, {}, get_queue_stat(v2));
                    }

                    ++map_queues_stats[v2].max_agents;
                    v.status !== 'off' ? ++map_queues_stats[v2].current_agents : true;
                    v.status === 'answered' ? ++map_queues_stats[v2].current_calls : true;

                    queue_string += queue_string === '' ? v2 : ' ' + v2;

                    if(!(v2 in v.queues_list)) {
                        v.queues_list[v2] = {
                            calls_missed: 0,
                            call_per_hour: 0,
                            call_per_day: 0
                        }
                    }

                    if(v.id in map_current_stat && 'queues_list' in map_current_stat[v.id] && v2 in map_current_stat[v.id].queues_list) {
                        v.new_calls = map_current_stat[v.id].queues_list[v2].new_calls;
                        v.queues_list[v2].call_per_hour += map_current_stat[v.id].queues_list[v2].new_calls;
                        v.queues_list[v2].call_per_day += map_current_stat[v.id].queues_list[v2].new_calls;
                    }
                });
                v.queues = queue_string;

                map_agents_stats[v.id] = v;
            });

            data.agents.sort(function(a, b) {
                return map_sort_status[a.status] < map_sort_status[b.status] ? -1 : 1;
            });

            $.each(data.queues_live_stats.data.current_stats, function(k, v) {
                if(v.calls) {
                    $.each(v.calls, function(k2, call) {
                        if(!(k in map_queues_stats)) {
                            $.extend(true, {}, get_queue_stat(k));
                        }

                        if(call.abandoned) {
                            console.log('++aba');
                            map_queues_stats[k].dropped_calls++;
                        }
                        else if(call.agent_id) {
                            map_queues_stats[k].max_calls++;
                        }
                    });
                }
            });

            $.each(data.queues, function(k, v) {
                $.extend(true, v, get_queue_stat(v.id));
                if(v.average_hold_time || v.average_hold_time === 0) {
                    //we sum all the wait time in average hold time first, so now we need to divide it by the number of calls to have an average wait time */
                    if((v.max_calls + v.dropped_calls) !== 0) {
                        v.average_hold_time /= (v.max_calls + v.dropped_calls);
                    }
                    else {
                        v.average_hold_time = 0;
                    }

                    v.average_hold_time = THIS.get_time_seconds(Math.round(v.average_hold_time));
                    total_calls += v.max_calls;
                    active_calls += v.current_calls;
                }
            });

            data.total_calls = total_calls;
            data.active_calls = active_calls;

            data.template = {
                agents: map_agents_stats,
                queues: map_queues_stats
            };
            console.log(data.template);
            return data;
        },

        format_queues_stats: function(data) {
            var THIS = this,
                map_queues_stats = {},
                queue;

            $.each(data.queues_stats.data, function(k, v) {
                queue = map_queues_stats[v.queue_id] || {
                    current_calls: 0,
                    max_calls: 0,
                    current_agents: 0,
                    max_agents: 0,
                    dropped_calls: 0,
                    average_hold_time: 0
                };

                if(v.calls) {
                    $.each(v.calls, function(k2, v2) {
                        queue.max_calls++;

                        if(v2.abandoned) {
                            queue.dropped_calls++;
                        }
                        else if(v2.duration && v2.agent_id) {
                            if(v2.wait_time) {
                                queue.average_hold_time+=v2.wait_time;
                            }
                            //TODO IF timestamp, add current
                        }
                    });
                }

                map_queues_stats[v.queue_id] = queue;
            });

            return map_queues_stats;
        },

//TODO
        format_agents_stats: function(data) {
            var THIS = this,
                map_agents_stats = {},
                agent;

            $.each(data.agents_stats.data, function(k, v) {
                agent = map_agents_stats[v.agent_id] || {
                    status: 'off',
                    call_time: 0,
                    break_time: 0,
                    call_per_hour: 0,
                    call_per_day: 0,
                    calls_missed: 0,
                    queues_list: {}
                };

                if(v.calls_missed) {
                    $.each(v.calls_missed, function(k2, v2) {
                        agent.calls_missed++;

                        if(v2.queue_id && !(v2.queue_id in agent.queues_list)) {
                            agent.queues_list[v2.queue_id] = {
                                calls_missed: 0,
                                call_per_hour: 0,
                                call_per_day: 0
                            }
                        }

                        agent.queues_list[v2.queue_id].calls_missed++;
                    });
                }

                if(v.calls_handled) {
                    $.each(v.calls_handled, function(k2, v2) {
                        if(v2.queue_id && !(v2.queue_id in agent.queues_list)) {
                            agent.queues_list[v2.queue_id] = {
                                calls_missed: 0,
                                call_per_hour: 0,
                                call_per_day: 0
                            }
                        }

                        if(THIS.get_diff_seconds(v.recorded_at) < 3600) {
                            agent.call_per_hour++;
                            agent.queues_list[v2.queue_id].call_per_hour++;
                        }
                        agent.call_per_day++;
                        agent.queues_list[v2.queue_id].call_per_day++;
                    });
                }

                map_agents_stats[v.agent_id] = agent;
            });

            return map_agents_stats;
        },

        get_diff_seconds: function(timestamp) {
            var date_var = new Date((timestamp - 62167219200)*1000).valueOf(),
                date_now = new Date().valueOf();

            return Math.round((date_now - date_var)/1000);
        },

        render_dashboard: function(_parent, callback) {
            var THIS = this,
                parent = _parent;

            THIS.clean_timers();

            THIS.get_agents_stats(function(_data_stats_agents) {
                THIS.get_queues_stats(function(_data_stats_queues) {
                    THIS.get_queues_livestats(true, function(_data_live_queues) {
                        THIS.get_agents_livestats(true, function(_data_live_agents) {
                            winkstart.request('dashboard.queues.list', {
                                    api_url: winkstart.apps['call_center'].api_url,
                                    account_id: winkstart.apps['call_center'].account_id
                                },
                                function(_data_queues, status) {
                                    winkstart.request('dashboard.agents.get', {
                                            api_url: winkstart.apps['call_center'].api_url,
                                            account_id: winkstart.apps['call_center'].account_id
                                        },
                                        function(_data_agents, status) {
                                            var _data = {
                                                queues: _data_queues.data,
                                                agents: _data_agents.data,
                                                agents_stats: _data_stats_agents,
                                                queues_stats: _data_stats_queues,
                                                agents_live_stats: _data_live_agents,
                                                queues_live_stats: _data_live_queues,
                                            };

                                            _data = THIS.format_data(_data);

                                            dashboard_html = THIS.templates.dashboard.tmpl(_data);

                                            THIS.poll_agents(_data, parent);
                                            //THIS.move_gauge(_data.active_calls, _data.total_calls, dashboard_html);

                                            (parent)
                                                .empty()
                                                .append(dashboard_html);

                                            THIS.render_callwaiting_list(dashboard_html);

                                            $('*[rel=popover]:not([type="text"])', parent).popover({
                                                trigger: 'hover'
                                            });

                                            $('.icon.edit_queue', dashboard_html).hide();

                                            $('.list_queues_inner > li', dashboard_html).click(function() {
                                                var $this_queue = $(this),
                                                    queue_id = $this_queue.attr('id');

                                                if($this_queue.hasClass('active')) {
                                                    //THIS.move_gauge(_data.active_calls, _data.total_calls, parent);
                                                    $('.agent_wrapper', dashboard_html).show();
                                                    $('.all_data', dashboard_html).show();
                                                    $('.queue_data', dashboard_html).hide();
                                                    $('#callwaiting-list li', dashboard_html).show();
                                                    $('.icon.edit_queue', dashboard_html).hide();
                                                    $('.list_queues_inner > li', dashboard_html).removeClass('active');
                                                }
                                                else {
                                                    THIS.detail_stat($this_queue, parent);
                                                }
                                            });

                                            $('.list_queues_inner > li .edit_queue', dashboard_html).click(function() {
                                                //THIS IS A HACK. :)
                                                $('.popover').remove();

                                                var dom_id = $(this).parents('li').first().attr('id');
                                                winkstart.publish('queue.activate', { parent: $('#ws-content'), callback: function() {
                                                    winkstart.publish('queue.edit', { id: dom_id });
                                                }});
                                            });

                                            if(typeof callback === 'function') {
                                                callback()
                                            }
                                        }
                                    );
                                }
                            );
                        });
                    });
                });
            });
        },

        detail_stat: function(container, parent) {
            var THIS = this,
                $this_queue = container,
                queue_id = $this_queue.attr('id');

            //THIS.move_gauge($this_queue.dataset('current_calls'), $this_queue.dataset('total_calls'), parent);

            $('.list_queues_inner > li', parent).removeClass('active');
            $('.icon.edit_queue', parent).hide();

            $('.icon.edit_queue', $this_queue).show();
            $this_queue.addClass('active');

            $('#callwaiting-list li', parent).each(function(k, v) {
                var $v = $(v);

                if($v.dataset('queue_id') !== queue_id) {
                    $v.hide();
                }
                else {
                    $v.show();
                }
            });

            $('.agent_wrapper', parent).each(function(k, v) {
                var $v = $(v);

                if($v.dataset('queues').indexOf(queue_id) < 0) {
                    $v.hide();
                }
                else {
                    $v.show();
                    $('.all_data', $v).hide();
                    $('.queue_stat', $v).hide();
                    $('.queue_stat[data-id='+queue_id+']', $v).show();
                    $('.queue_data', $v).show();
                }
            });
        },

        clean_timers: function() {
            var THIS = this;

            if(THIS.global_timer !== false) {
                clearInterval(THIS.global_timer);
                THIS.global_timer = false;
            }

            THIS.map_timers = {
                users: {},
                breaks: {},
                calls: {}
            };
        },

        activate_queue_stat: function(args) {
            var THIS = this,
                parent = args.parent || $('#ws-content');

            parent.empty();

            THIS.render_dashboard(parent, function() {
                var $this_queue = $('#'+args.id, parent);

                THIS.detail_stat($this_queue, parent);
            });
        },

        activate: function(_parent) {
            var THIS = this,
                parent = _parent || $('#ws-content');

            parent.empty();

            THIS.render_dashboard(parent);
        }
    }
);
