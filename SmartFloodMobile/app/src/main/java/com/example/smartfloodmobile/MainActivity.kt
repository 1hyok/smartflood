package com.example.smartfloodmobile

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.android.volley.Request
import com.android.volley.toolbox.StringRequest
import com.android.volley.toolbox.Volley

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            SmartFloodApp()
        }
    }
}

@Composable
fun SmartFloodApp() {
    var result by remember { mutableStateOf("여기에 결과가 표시됩니다") }
    var isLoading by remember { mutableStateOf(false) }
    val context = LocalContext.current

    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        Text(
            text = "🌊 SmartFlood",
            fontSize = 28.sp,
            fontWeight = FontWeight.Bold,
            textAlign = TextAlign.Center,
            modifier = Modifier.fillMaxWidth()
        )

        Spacer(modifier = Modifier.height(32.dp))

        Button(
            onClick = {
                isLoading = true
                val queue = Volley.newRequestQueue(context)
                val url = "http://10.0.2.2:3000/api/flood-risk"

                val stringRequest = StringRequest(Request.Method.GET, url,
                    { response ->
                        result = "침수 위험도:\n\n$response"
                        isLoading = false
                    },
                    { error ->
                        result = "연결 실패: ${error.message}"
                        isLoading = false
                    })

                queue.add(stringRequest)
            },
            modifier = Modifier
                .fillMaxWidth()
                .height(56.dp),
            enabled = !isLoading
        ) {
            if (isLoading) {
                CircularProgressIndicator(modifier = Modifier.size(20.dp))
            } else {
                Text("침수 위험도 확인", fontSize = 18.sp)
            }
        }

        Spacer(modifier = Modifier.height(16.dp))

        Button(
            onClick = {
                isLoading = true
                val queue = Volley.newRequestQueue(context)
                val url = "http://10.0.2.2:3000/api/weather"

                val stringRequest = StringRequest(Request.Method.GET, url,
                    { response ->
                        result = "기상정보:\n\n$response"
                        isLoading = false
                    },
                    { error ->
                        result = "연결 실패: ${error.message}"
                        isLoading = false
                    })

                queue.add(stringRequest)
            },
            modifier = Modifier.fillMaxWidth(),
            enabled = !isLoading
        ) {
            Text("실시간 기상정보")
        }

        Spacer(modifier = Modifier.height(24.dp))

        Card(
            modifier = Modifier
                .fillMaxWidth()
                .weight(1f)
        ) {
            Text(
                text = result,
                modifier = Modifier
                    .padding(16.dp)
                    .verticalScroll(rememberScrollState()),
                fontSize = 16.sp
            )
        }
    }
}