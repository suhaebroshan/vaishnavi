import android.app.Application;
import com.getcapacitor.BridgeConfiguration;
import com.getcapacitor.Plugin;
import java.util.ArrayList;

public class MainApplication extends Application implements Plugin.LoadListener {
    private BridgeConfiguration config;

    @Override
    public void onCreate() {
        super.onCreate();
    }

    @Override
    public void onPluginLoad(Plugin plugin) {
    }
}
